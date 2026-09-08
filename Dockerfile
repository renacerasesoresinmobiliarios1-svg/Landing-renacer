# -----------------------------------------------------------
# Stage 1: Build Frontend Assets (React + Vite + TailwindCSS)
# -----------------------------------------------------------
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install
COPY . .
RUN npm run build

# -----------------------------------------------------------
# Stage 2: Install Composer Dependencies
# -----------------------------------------------------------
FROM composer:2 AS composer
WORKDIR /app
COPY composer*.json ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts
COPY . .
RUN composer dump-autoload --optimize --no-dev

# -----------------------------------------------------------
# Stage 3: Final Production Image (PHP 8.3 FPM + Nginx Alpine)
# -----------------------------------------------------------
FROM php:8.3-fpm-alpine

# Install system dependencies, Nginx, gettext (for envsubst), and library extensions
RUN apk add --no-cache \
    nginx \
    gettext \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    icu-dev \
    oniguruma-dev \
    curl

# Install and configure PHP extensions required by Laravel 12
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        intl \
        zip \
        opcache

# Set up OPcache configuration
RUN { \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.interned_strings_buffer=8'; \
        echo 'opcache.max_accelerated_files=4000'; \
        echo 'opcache.revalidate_freq=2'; \
        echo 'opcache.fast_shutdown=1'; \
        echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

WORKDIR /var/www/html

# Copy application code
COPY . /var/www/html

# Copy PHP vendor dependencies from composer stage
COPY --from=composer /app/vendor /var/www/html/vendor

# Copy compiled frontend assets from node stage
COPY --from=frontend /app/public/build /var/www/html/public/build

# Copy Nginx template and entrypoint script
COPY docker/nginx.conf /etc/nginx/templates/default.conf.template
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Prepare permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
