const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const filePath = 'users.json';

// Чтение данных из файла
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
};

// Запись данных в файл
const writeDataToFile = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
};

// Обработчик для получения всех пользователей
app.get('/users', (req, res) => {
  const users = readDataFromFile();
  res.json(users);
});

// Обработчик для получения пользователя по ID
app.get('/users/:id', (req, res) => {
  const users = readDataFromFile();
  const userId = parseInt(req.params.id);

  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Обработчик для создания нового пользователя
app.post('/users', (req, res) => {
  const users = readDataFromFile();
  const newUser = req.body;

  // Генерация уникального ID для нового пользователя
  newUser.id = users.length + 1;

  users.push(newUser);
  writeDataToFile(users);

  res.json(newUser);
});

// Обработчик для обновления пользователя по ID
app.put('/users/:id', (req, res) => {
  const users = readDataFromFile();
  const userId = parseInt(req.params.id);

  const index = users.findIndex((u) => u.id === userId);

  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    writeDataToFile(users);
    res.json(users[index]);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Обработчик для удаления пользователя по ID
app.delete('/users/:id', (req, res) => {
  const users = readDataFromFile();
  const userId = parseInt(req.params.id);

  const filteredUsers = users.filter((u) => u.id !== userId);

  if (filteredUsers.length < users.length) {
    writeDataToFile(filteredUsers);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
