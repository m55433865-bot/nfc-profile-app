const express = require('express');
const path = require('path');
const browserSync = require('browser-sync').create();

const app = express();
const PORT = 3000;

const users = {
  mohamed: {
    bio: "Developer",
    links: [
      { name: "Instagram", url: "https://instagram.com" },
      { name: "WhatsApp", url: "https://wa.me/123456789" }
    ]
  },
  ahmed: {
    bio: "Designer",
    links: [
      { name: "Portfolio", url: "https://example.com" }
    ]
  }
};

app.use(express.static('public'));

// ✅ API route
app.get('/api/:username', (req, res) => {
  const username = req.params.username.toLowerCase();

  if (!users[username]) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    username,
    ...users[username]
  });
});

// profile page
app.get('/:username', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  browserSync.init({
    proxy: `http://localhost:${PORT}`,
    files: ["public/**/*.*"],
    open: true
  });
});