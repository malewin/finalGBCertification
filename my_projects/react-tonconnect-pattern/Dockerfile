# Используйте образ Node.js для сборки вашего приложения
FROM node:18 AS build

# Установите рабочую директорию
WORKDIR /app

# Скопируйте package.json и yarn.lock (если он есть)
COPY package.json yarn.lock ./

# Установите зависимости с помощью yarn, без установки Yarn глобально
RUN yarn install

# Скопируйте остальные файлы приложения
COPY . .

# Соберите приложение для продакшен-режима
RUN yarn vite build

# Используйте Nginx для обслуживания скомпилированного приложения
FROM nginx:latest

# Копируйте скомпилированные файлы в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

