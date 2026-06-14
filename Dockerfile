# ---- PHP + Node ----
    FROM php:8.4-apache AS backend

    RUN a2enmod rewrite
    
    # PHP extensions
    RUN docker-php-ext-install pdo_mysql bcmath
    
    # Composer
    COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
    
    # Node for Vite/NPM builds
    RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
        && apt-get install -y nodejs \
        && apt-get clean
    
    WORKDIR /app
    COPY . .
    
    # Laravel setup
    RUN composer install --no-dev --optimize-autoloader
    RUN npm ci && npm run build
    RUN php artisan storage:link || true
    
    # ---- Python ML server ----
    RUN apt-get update && apt-get install -y python3 python3-pip && apt-get clean
    RUN pip3 install -r requirements.txt 2>/dev/null || pip3 install flask numpy pandas scikit-learn joblib gunicorn
    
    # ---- Supervisor to run both processes ----
    RUN apt-get install -y supervisor && apt-get clean
    COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
    
    EXPOSE 80 5001
    CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]