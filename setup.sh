#!/bin/bash

# Функция для вывода сообщений с цветом
echo_color() {
    echo -e "\033[1;32m$1\033[0m"  # Зеленый цвет
}

# Получаем IP-адрес текущего сервера
server_ip=$(hostname -I | awk '{print $1}')

# Флаг для этапа update
run_update=false

# Обрабатываем флаг -u
while getopts ":u" opt; do
  case ${opt} in
    u )
      run_update=true
      ;;
    \? )
      echo "Неверная опция: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# Выполняем update.sh, если передан флаг -u
if [ "$run_update" = true ]; then
    source ./sh/update.sh
fi

# Выполняем оставшиеся этапы
source ./sh/proxy.sh

# Завершение скрипта
echo_color "Настройка завершена.
Теперь вы можете запустить Docker Compose"
echo "docker-compose up -d
"

# Сообщение о проверке ADNL-сайта
echo_color "После запуска docker-compose вы можете проверить работу ADNL-сайта по адресу"
echo "https://${adnl_code}.adnl.run"
echo_color "и сравнить со страничками по прямому адресу"
echo "http://${server_ip}:80
"