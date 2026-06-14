FROM php:8.4-apache AS backend


RUN a2enmod rewrite && \
    sed -i 's|/var/www/html|/app/public|g' /etc/apache2/sites-available/000-default.conf && \
    sed -i 's|/var/www/html|/app/public|g' /etc/apache2/apache2.conf
# System deps: zip/unzip for Composer, nodejs for Vite, python3 for ML, supervisor
RUN apt-get update && apt-get install -y \
zip unzip libzip-dev nodejs npm python3 python3-pip supervisor \
    && apt-get clean

# PHP extensions
RUN docker-php-ext-install pdo_mysql bcmath zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# Laravel setup
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build
RUN php artisan storage:link || true

# Python ML deps
RUN pip3 install -r requirements.txt --break-system-packages 2>/dev/null || \
    pip3 install flask numpy pandas scikit-learn joblib gunicorn --break-system-packages

# Supervisor config
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80 5001
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]