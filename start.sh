#!/usr/bin/env bash

# Install dependencies
composer install --optimize-autoloader --no-dev

# Migrate database
php artisan migrate --force

# Serve the app
php artisan serve --host=0.0.0.0 --port=8080
