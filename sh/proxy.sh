#!/bin/bash

# Создаем папку для keyring
mkdir -p /opt/ton-proxy/keyring

# Изменяем права на папку keyring для пользователя и группы с ID 1001
chown -R 1001:1001 /opt/ton-proxy/keyring

# Запускаем Docker контейнер с тон-прокси и генерируем adnl_[port], сохраняем в файл adnl_[port].txt
docker run -v /opt/ton-proxy/keyring:/opt/ton-proxy tonstakers/ton-proxy:latest generate-random-id -m adnlid > /opt/ton-proxy/adnl_code.txt

# Извлекаем второй набор символов из файлов adnl_[port].txt
adnl_code=$(awk '{print $2}' /opt/ton-proxy/adnl_code.txt)

# Разрешаем порт 3333 для UDP через ufw
ufw allow 3333/udp

# Создание файла docker-compose.yml
cat <<EOL > docker-compose.yml
version: '3'
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./my_projects/default.conf:/etc/nginx/conf.d/default.conf
      - ./my_projects/public/:/usr/share/nginx/html/
    restart: always
  tonproxy:
    image: tonstakers/ton-proxy:latest
    container_name: tonproxy
    hostname: tonproxy
    network_mode: host
    volumes:
      - /opt/ton-proxy/keyring:/opt/ton-proxy/keyring
    command: "rldp-http-proxy -a ${server_ip}:3333 -R '*'@127.0.0.1:80 -C global.config.json -A ${adnl_code} -d"
    logging:
      driver: json-file
      options:
        max-size: 100m
        max-file: '2'
  nodejs:
    build:
      context: ./my_projects/node_app  # Путь к Node.js
    ports:
      - "3000:3000"
EOL

echo_color "docker-compose.yml создан успешно"