#### Запуск:

#### Get Started:

```
* Допустим вы уже арендовали хостинг, сгенерировали ssh ключ на своем локальном компьютере и установили соединение с ключом на самом хостинге для работы удаленно с локального компьютера. / Let's say you've already rented a hosting, generated an ssh key on your local computer and established a connection with the key on the hosting itself to work remotely from your local computer.

** Загрузите папку tonproxy_nodejs_nginx из этого архива на свой хостинг (допусти в папку /root) через консоль / Upload the tonproxy_nodejs_nginx folder from this archive to your hosting (let's say to the /root folder) via the console:

0. scp -r path/to/directory/tonproxy_nodejs_nginx ssh root@your_ip_of_host:/root
(введите пароль ssh либо самого хостинга если не паролили ssh / enter the ssh password or the hosting password itself if you haven't set the ssh password)

1. cd tonproxy_nodejs_nginx          (go to directory) / переходим в директорию проекта
2. chmod +x setup.sh                 (get rules for user) / выдаем права на запуск файла
3. ./setup.sh -u                     ( '-u' for update linux and docker-compose setup , GET YOUR adnl) / запускаем автоматизированный скрипт выдачи adnl со всеми сопутствующими установками (обновление системы и установка докера - флаг '-u')
4. cd ./my_projects                  (go to directory) / переходим в директорию проекта
5. cd ./node_app                     (go to directory) / переходим в директорию проекта
6. apt install npm                   (install npm-manager) / устанавливаем пакетный менеджер
7. npm init -y                       (initialization of project) / инициализируем проект для создания package.json
8. npm install nodejs express cors   (install of require dependencies) / устанавливаем все необходимые модули указанные в server.js
9. npm init -y                       (for upadte of require dependencies) / обновляем зависимости в package.json - АРХИВАЖНО
10. cd ../
11. cd ../                           (back to directory 'tonproxy_nodejs_nginx') / возвращаемся в директорию tonproxy_nodejs_nginx
12. docker-compose up --build -d     (building and start of container's cluster) / запускаем кластер контейнеров

Completed!
На пункте 3 вам сгенерирует вашу ссылку наподобие: https://ww3rakd4x5puda6252pcas4kwptiwimaklzfrsyexyd6iykggjo7wrl.adnl.run/
At point 3 it will generate your link for you like this: https://ww3rakd4x5puda6252pcas4kwptiwimaklzfrsyexyd6iykggjo7wrl.adnl.run/

Вы можете проверить работу вашего запроксированного динамического сайте по ней, однако 'ww3rakd4x5puda6252pcas4kwptiwimaklzfrsyexyd6iykggjo7wrl' из данного примера не является тем же adnl который должен быть привязан к домену.
Для получения валидного adnl для привязки во второе поле вашего домена вам необходимо ввести /
You can check the work of your proxied dynamic site by it, however 'ww3rakd4x5puda6252pcas4kwptiwimaklzfrsyexyd6iykggjo7wrl' from this example is not the same adnl that should be linked to the domain.
To get a valid adnl for linking in the second field of your domain you need to enter:

13. cat /opt/ton-proxy/adnl_code.txt

первый adnl отображенный в консоли - будет тем что вам нужен
Переходим на dns.ton.org , находим ваш домен который у вас на кошельке, кликаем Manage и вставляем adnl во второе поле, жмем Save - подтверждаем транзакцию.

Теперь ваш сайт может быть открыт по адрессу {your_domain}.ton.run в обычном браузере либо {your_domain}.ton в Telegram / Tonkeeper

Помимо .run существуют приписки других публичных прокси : {your_domain}.ton.sc , {your_domain}.ton.website , {your_domain}-dton.magic.org
```
# finalCertification
# finalCertification
