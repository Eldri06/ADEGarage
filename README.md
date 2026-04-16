<div align="center">

# 🔧 ADE Garage

**Your one-stop online shop for garage essentials.**

A full-stack web application built with Laravel 9 — featuring product browsing, cart management, order tracking, and a dedicated admin dashboard.

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

---

## 📖 About

**ADE Garage** is a Laravel-based e-commerce web application that lets customers browse products, manage their cart, and place orders — while admins handle inventory, order statuses, and user management from a dedicated dashboard. Authentication supports both traditional login and Google OAuth.

---

## ✨ Features

**🛍️ Product Browsing**
- View all available products
- Individual product detail pages
- Admin-managed product listings (add, update, delete)

**🛒 Cart System**
- Add, update, and remove cart items
- Works for both guests and logged-in users
- Full cart clear functionality

**📦 Order Management**
- Place orders from cart
- View personal order history
- Cancel pending orders
- Admin can view all orders and update their status

**👤 User Accounts**
- Register and log in with email/password
- Google OAuth login support
- Profile management (personal details + password update)

**🔐 Admin Dashboard**
- Role-based access with admin middleware
- Manage products, orders, and users
- Separate admin views and controls

---

## 💻 Prerequisites

Make sure you have the following installed:

- PHP >= 8.0.2
- Composer
- Node.js & npm
- MySQL or any supported database
- Git

---

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Eldri06/ADEGarage.git
```

2. Navigate into the project:
```bash
cd ade-garage
```

3. Install PHP dependencies:
```bash
composer install
```

4. Install frontend dependencies:
```bash
npm install
```

5. Copy the environment file and configure it:
```bash
cp .env.example .env
php artisan key:generate
```

6. Set up your database in `.env`, then run migrations:
```bash
php artisan migrate
```

7. Start the development server:
```bash
php artisan serve
npm run dev
```

---

## 🤝 Contributors

| Name | Role | GitHub |
|------|------|--------|
| Karyll Mae Salipot | Frontend Developer | [@cykai](https://github.com/cykai) |
| Kristina Melquery Marcojos | UI/UX Designer | [@__km070105__](https://github.com/__km070105__) |
| Shayne Silagan | Frontend Developer | [@shaensil](https://github.com/shaensil) |
| Eldrian Colinares | Backend Developer & Database | [@Eldri06](https://github.com/Eldri06) |
| Junaica Layni | Backend Developer & Project Manager | [@nikss07](https://github.com/nikss07) |
---

## 📄 License

This project was developed for academic purposes. All rights reserved by the ADE Garage team.

<br>

<div align="center">
  <sub>Built with 🔧 and ☕ by the ADE Garage Team</sub>
</div>