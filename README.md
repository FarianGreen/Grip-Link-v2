# 🥋 BJJ Social — Социальная платформа для BJJ-комьюнити
![CI/CD Status](https://github.com/FarianGreen/Grip-Link-v2/actions/workflows/ci.yml/badge.svg)

Pet-проект, разработанный с целью продемонстрировать fullstack-компетенции в рамках создания социальной платформы для спортсменов и фанатов **Brazilian Jiu-Jitsu**.  
Проект включает в себя: авторизацию, мессенджер, редактируемый профиль, загрузку файлов и real-time общение.

---

## 🚀 Демо

🚧 Пока не задеплоено  
(в планах: Render + Vercel)

---

## 🧠 Технологический стек

### ⚛️ **Frontend**
- **React 19 + TypeScript**
- **React Router DOM v7**
- **Redux Toolkit** для глобального состояния
- **React Hook Form** + **Zod** — удобные формы и валидация
- **Axios** — HTTP-запросы
- **Socket.IO client** — реалтайм события
- **SASS** — стилизация
- **UUID** — генерация уникальных ключей
- **React Error Boundary** — graceful UI fallback

### 🟢 **Backend**
- **Node.js + Express** — API и маршруты
- **TypeORM + PostgreSQL** — ORM + БД
- **Socket.IO + WS** — WebSocket сервер
- **JWT + Cookie-Parser** — аутентификация
- **Multer** — загрузка файлов
- **Express-Validator** — валидация на бэке
- **CORS, dotenv, tsconfig-paths** — инфраструктура

---

## 🧩 Реализовано в v1.0.0

### 🔐 Аутентификация
- Регистрация и логин с проверкой данных
- Хранение JWT в `httpOnly` cookie
- Middleware-защита приватных маршрутов
- Валидаторы на сервере и клиенте

### 👤 Пользовательский профиль
- Страница профиля с отображением имени, аватарки и bio
- Редактирование профиля (имя, описание)
- Загрузка аватара с сохранением (пока локально)
- Валидация форм через React Hook Form + Zod

### 💬 Мессенджер (реалтайм)
- Просмотр списка пользователей
- Создание приватных чатов
- Отправка и получение сообщений в реальном времени
- WebSocket-соединение через Socket.IO (сервер и клиент)

### 🗂️ Архитектура и структура
- Разделение на backend и frontend
- Использование TypeORM + PostgreSQL для работы с БД
- Сущности: `User`, `Chat`, `Message`
- Контроллеры: `AuthController`, `UserController`, `ChatController`, `MessageController`
- Middleware: валидация, авторизация
- Миграции и подключение к PostgreSQL 

### 📦 Инфраструктура
- CI/CD: GitHub Actions с авто-сборкой фронта и бэка
- Оформление репозитория: README, .gitignore
- Подготовка к деплою (в процессе выбора)

## 📦 Структура проекта