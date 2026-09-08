#!/bin/sh
set -e

# Default PORT to 10000 if not set (Render default)
export PORT=${PORT:-10000}

# Configure PHP-FPM to preserve environment variables for workers
if [ -f /usr/local/etc/php-fpm.d/www.conf ]; then
    sed -i 's/^;*clear_env = .*/clear_env = no/' /usr/local/etc/php-fpm.d/www.conf
    sed -i 's/^;*catch_workers_output = .*/catch_workers_output = yes/' /usr/local/etc/php-fpm.d/www.conf
fi

# Create destination directory for nginx config if not present
mkdir -p /etc/nginx/http.d

# Substitute PORT variable into nginx config
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/http.d/default.conf

# Ensure database directory and SQLite file exist
mkdir -p /var/www/html/database
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    if [ ! -f /var/www/html/database/database.sqlite ]; then
        touch /var/www/html/database/database.sqlite
    fi
fi

# Ensure storage and bootstrap/cache directories exist
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache

# Generate APP_KEY if missing
if [ -z "$APP_KEY" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force || true
fi

# Run Laravel storage link
php artisan storage:link --force || true

# Run database migrations and seed initial data
echo "Executing database migrations..."
php artisan migrate --force || echo "Warning: Migrations could not run immediately."

echo "Seeding initial properties and users..."
php artisan db:seed --force || echo "Warning: Seeder could not run immediately."

# Clear configuration, route and view cache so runtime env vars are read dynamically
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Final ownership and permissions for www-data on storage, cache and database
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod 666 /var/www/html/database/database.sqlite 2>/dev/null || true

# Start PHP-FPM in background
echo "Starting PHP-FPM..."
php-fpm -D

# Start Nginx in foreground
echo "Starting Nginx on port $PORT..."
exec nginx -g "daemon off;"
