#!/bin/bash

# Обновление системы
echo_color "Обновление системы..."
apt update && apt upgrade -y

# Установка необходимых пакетов
echo_color "Установка пакетов для установки Docker..."
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Установка Docker
echo_color "Установка Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt update
apt install -y docker-ce

# Установка Docker Compose
echo_color "Установка Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose