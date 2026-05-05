const express = require('express');
const path = require('path');
const fs = require('fs');
const browserSync = require('browser-sync').create();

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json()); // important

function getUsers() {
  return JSON.parse(fs.readFileSync('data.json'));
}

function saveUsers(data) {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// GET user
app.get('/api/:username', (req, res) => {
  const users = getUsers();
  const username = req.params.username.toLowerCase();

  if (!users[username]) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    username,
    ...users[username]
  });
});

// UPDATE user
app.post('/api/:username', (req, res) => {
  const users = getUsers();
  const username = req.params.username.toLowerCase();

  if (!users[username]) {
    return res.status(404).json({ error: "User not found" });
  }

  const { password, bio, links, avatar } = req.body;

  if (users[username].password !== password) {
    return res.status(403).json({ error: "Wrong password" });
  }

  users[username].bio = bio;
  users[username].links = links;

  if (avatar !== undefined) {
    users[username].avatar = avatar;
  }

  saveUsers(users);

  res.json({ success: true });
});

// page
app.get('/:username', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  browserSync.init({
    proxy: `http://localhost:${PORT}`,
    files: ["public/**/*.*"],
    open: false
  });
});