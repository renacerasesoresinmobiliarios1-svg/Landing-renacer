# -----------------------------------------------------------
# Production Image (PHP 8.3 FPM + Nginx + Composer + Node)
# -----------------------------------------------------------
FROM php:8.3-fpm-alpine

# Install system utilities, Nginx and envsubst
RUN apk add --no-cache nginx gettext curl nodejs npm

# Install PHP extensions using official installer
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN install-php-extensions \
    pdo_pgsql \
    pdo_mysql \
    pdo_sqlite \
    bcmath \
    gd \
    intl \
    zip \
    opcache \
    pcntl \
    exif

# Copy Composer from official composer image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . /var/www/html

# Create default .env from .env.example
RUN cp .env.example .env

# Install Composer PHP dependencies
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Install NPM dependencies and build Vite frontend assets
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps
RUN npm run build

# Remove node_modules to keep final image small
RUN rm -rf node_modules

# Copy Nginx template and entrypoint
COPY docker/nginx.conf /etc/nginx/templates/default.conf.template
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set up OPcache
RUN { \
        echo 'opcache.memory_consumption=128'; \
        echo 'opcache.interned_strings_buffer=8'; \
        echo 'opcache.max_accelerated_files=4000'; \
        echo 'opcache.revalidate_freq=2'; \
        echo 'opcache.fast_shutdown=1'; \
        echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
