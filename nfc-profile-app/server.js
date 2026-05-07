const express = require('express');
const path = require('path');
const fs = require('fs');
const browserSync = require('browser-sync').create();

const app = express();
const PORT = 3000;
const ADMIN_USERNAME = "66546788";
const ADMIN_PASSWORD = "123";

app.use(express.static('public'));
app.use(express.json()); // important

function getUsers() {
  const users = JSON.parse(fs.readFileSync('data.json'));

  Object.keys(users).forEach((username) => {
    const user = users[username];

    if (!user.displayName) {
      user.displayName = username;
    }

    if (!user.bio) {
      user.bio = "";
    }

    if (!user.avatar) {
      user.avatar = "";
    }

    if (!Array.isArray(user.links)) {
      user.links = [];
    } else {
      user.links = user.links.filter((link) => link && link.name && link.url);
    }
  });

  return users;
}

function saveUsers(data) {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

function isAdminRequest(req) {
  return req.headers["x-admin-username"] === ADMIN_USERNAME &&
    req.headers["x-admin-password"] === ADMIN_PASSWORD;
}

function requireAdmin(req, res) {
  if (!isAdminRequest(req)) {
    res.status(403).json({ error: "Admin only" });
    return false;
  }

  return true;
}

// ADMIN: list users
app.get('/api/admin/users', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const users = getUsers();
  const list = [
    { username: ADMIN_USERNAME, displayName: "Admin", isAdmin: true },
    ...Object.keys(users)
      .filter((username) => username !== ADMIN_USERNAME)
      .map((username) => ({
        username,
        displayName: users[username].displayName || username,
        isAdmin: false
      }))
  ];

  res.json({ users: list });
});

// ADMIN: create user
app.post('/api/admin/users', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const users = getUsers();
  const username = (req.body.username || "").trim().toLowerCase();
  const password = (req.body.password || "").trim();

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  if (username === ADMIN_USERNAME || users[username]) {
    return res.status(409).json({ error: "User already exists" });
  }

  users[username] = {
    password,
    displayName: username,
    bio: "",
    avatar: "",
    links: []
  };

  saveUsers(users);
  res.json({ success: true });
});

// ADMIN: change password
app.post('/api/admin/users/:username/password', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const users = getUsers();
  const username = req.params.username.toLowerCase();
  const password = (req.body.password || "").trim();

  if (username === ADMIN_USERNAME) {
    return res.status(403).json({ error: "Admin password is fixed" });
  }

  if (!users[username]) {
    return res.status(404).json({ error: "User not found" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  users[username].password = password;
  saveUsers(users);
  res.json({ success: true });
});

// ADMIN: delete user
app.delete('/api/admin/users/:username', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const users = getUsers();
  const username = req.params.username.toLowerCase();

  if (username === ADMIN_USERNAME) {
    return res.status(403).json({ error: "Admin user cannot be deleted" });
  }

  if (!users[username]) {
    return res.status(404).json({ error: "User not found" });
  }

  delete users[username];
  saveUsers(users);
  res.json({ success: true });
});

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

  const { password, bio, links, avatar, displayName, newPassword } = req.body;

  if (users[username].password !== password) {
    return res.status(403).json({ error: "Wrong password" });
  }

  users[username].bio = bio || "";
  users[username].links = Array.isArray(links)
    ? links.filter((link) => link && link.name && link.url)
    : [];

  if (displayName !== undefined) {
    users[username].displayName = displayName;
  }

  if (avatar !== undefined) {
    users[username].avatar = avatar;
  }

  if (newPassword !== undefined) {
    const cleanPassword = String(newPassword).trim();
    if (!cleanPassword) {
      return res.status(400).json({ error: "Password is required" });
    }

    users[username].password = cleanPassword;
  }

  saveUsers(users);

  res.json({ success: true });
});

// page
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get('/:username', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'edit.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  browserSync.init({
    proxy: `http://localhost:${PORT}`,
    files: ["public/**/*.*"],
    open: false
  });
});
