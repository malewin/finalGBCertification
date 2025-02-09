const express = require("express");
const fs = require("fs");
const cors = require("cors");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";
const LOG_FILE = "log.txt";

// Создание файла users.json, если он не существует
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Настройка middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// Эндпоинт для получения пользователей
app.get("/api/users", (req, res) => {
  if (fs.existsSync(USERS_FILE)) {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

    const sortedUsers = users
      .map((user) => ({
        ...user,
        rarity: user.rarity !== undefined ? user.rarity : 0, // Устанавливаем значение rarity по умолчанию
      }))
      .sort((a, b) => b.rarity - a.rarity);

    res.status(200).json(sortedUsers);
  } else {
    res.status(404).json({ message: "Users not found" });
  }
});

app.get("/api/proxy", async (req, res) => {
  const url = req.query.url; // Получаем URL как параметр запроса
  console.log(`Запрос картинки подарка: ${url}`);

  try {
    const response = await fetch(url);
    console.log(`HTTP статус ответа: ${response.status}`); // Логируем статус ответа

    if (!response.ok) {
      console.log(
        `Неудачный запрос к ${url}: ${response.status} ${response.statusText}`
      );
      return res.status(response.status).send("Error fetching the URL");
    }

    const data = await response.json();
    console.log(`Получены данные: ${JSON.stringify(data)}`); // Логируем данные
    res.json(data);
  } catch (error) {
    console.error("Ошибка при извлечении:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Логируем действия
app.post("/api/log", (req, res) => {
  const { address, action, domain } = req.body;
  logAction(address, `${action} domain: ${domain}`);
  res.status(200).send("Action logged");
});

// Эндпоинт для подключения пользователей и их деталей
app.post("/api/connect", (req, res) => {
  const { address, name, isHasContactsSubs } = req.body;

  // Чтение пользователей из файла
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } else {
    fs.writeFileSync(USERS_FILE, JSON.stringify([])); // Создаем файл, если не существует
  }

  // Проверяем и добавляем пользователя
  const existingUser = users.find((user) => user.address === address);
  if (!existingUser) {
    const newUser = {
      id: uuidv4(),
      address,
      name: name,
      isHasContactsSubs: isHasContactsSubs || false,
    };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log(`User added: ${newUser.address}`);
  }

  logAction(address, `Connected with name: ${name}`);

  res.status(201).json({ message: "User connected", address });
});

app.post("/api/update-contacts-subs", (req, res) => {
  console.log("Пришел запрос на обновление статуса подписки");
  const { address, isHasContactsSubs } = req.body;
  console.log(`для пользователя: ${address}`);
  console.log(`IsHasContactsSubs: ${isHasContactsSubs}`);

  // Чтение пользователей из файла
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } else {
    fs.writeFileSync(USERS_FILE, JSON.stringify([])); // Создаем файл, если не существует
  }

  const user = users.find((user) => user.address === address);
  if (user) {
    console.log(`User found: ${JSON.stringify(user, null, 2)}`);
    user.isHasContactsSubs = isHasContactsSubs;
    console.log(`User after update: ${JSON.stringify(user, null, 2)}`);

    // Установите временные метки завершения подписки
    if (isHasContactsSubs) {
      user.contactsSubsTimestamp = Date.now() + 30 * 24 * 60 * 60 * 1000; // +30 дней
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    logAction(address, `Updated subscriptions`);
    res.status(200).json({ message: "Subscription status updated", user });
  } else {
    console.log(`User not found for address: ${address}`); // Логирование не найденного пользователя
    res.status(404).json({ message: "User not found" });
  }
});

app.post("/api/update-profile", (req, res) => {
  const {
    address,
    newDomainName,
    avatarAddress,
    nomisAddress,
    giftAddress,
    giftLottie,
    usernameImgAddress,
    rarity,
    score,
    usernameAddress,
    usernameTelegram,
  } = req.body;

  let users = fs.existsSync(USERS_FILE)
    ? JSON.parse(fs.readFileSync(USERS_FILE, "utf8"))
    : [];

  const user = users.find((user) => user.address === address);
  if (user) {
    user.newDomainName = newDomainName;
    user.avatarAddress = avatarAddress;
    user.nomisAddress = nomisAddress;
    user.giftAddress = giftAddress;
    user.giftLottie = giftLottie;
    user.usernameImgAddress = usernameImgAddress; // Теперь здесь ссылка на изображение
    user.usernameAddress = usernameAddress; // Здесь адрес из NFT
    user.rarity = rarity;
    user.score = score || 0;
    user.usernameTelegram = usernameTelegram;

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.status(200).json({ message: "Profile updated", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Функция для логирования действий
function logAction(address, action) {
  const logMessage = `${new Date().toISOString()} [${address}]: ${action}\n`;
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
