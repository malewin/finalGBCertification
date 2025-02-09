# Используйте официальный Node.js образ
FROM node:18

# Установите рабочую директорию
WORKDIR /usr/src/app

# Скопируйте package.json и package-lock.json
COPY package*.json ./

# Установите зависимости
RUN npm install

# Скопируйте все остальное в рабочую директорию
COPY . .

# Откройте порт, который будет использоваться приложением
EXPOSE 3000

# Установите команду запуска вашего приложения
CMD ["node", "server.js"]

