const express = require('express');
const path = require('path');
const browserSync = require('browser-sync').create();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;
const ADMIN_USERNAME = "66546788";
const ADMIN_PASSWORD = "123";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://icxhlqummrtfpxzegbvd.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeGhscXVtbXJ0ZnB4emVnYnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjYyODQsImV4cCI6MjA5Mzc0MjI4NH0.15teqmpk7adjnANdLAWlrmfTJDRlXyGhiy-JiNqWnSI";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));

function sanitizeLinks(links) {
  return Array.isArray(links)
    ? links.filter((link) => link && link.name && link.url)
    : [];
}

function normalizeUser(row) {
  if (!row) return null;

  const username = (row.username || "").toLowerCase();

  return {
    id: row.id,
    username,
    password: row.password || "",
    displayName: row.displayname || username,
    bio: row.bio || "",
    avatar: row.avatar || "",
    links: sanitizeLinks(row.links)
  };
}

async function getUser(username) {
  const cleanUsername = username.toLowerCase();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', cleanUsername)
    .maybeSingle();

  if (error) throw error;
  return normalizeUser(data);
}

async function listUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('username', { ascending: true });

  if (error) throw error;
  return (data || []).map(normalizeUser);
}

async function createUser(username, password) {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  const { error } = await supabase
    .from('users')
    .insert({
      username: cleanUsername,
      password: cleanPassword,
      displayname: cleanUsername,
      bio: "",
      avatar: "",
      links: []
    });

  if (error) throw error;
}

async function updateUser(username, updates) {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('username', username.toLowerCase());

  if (error) throw error;
}

async function deleteUser(username) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('username', username.toLowerCase());

  if (error) throw error;
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

function sendSupabaseError(res, error) {
  console.error(error);

  if (error.code === "23505") {
    return res.status(409).json({ error: "Username already exists" });
  }

  if (error.code === "42501") {
    return res.status(403).json({ error: "Supabase permission denied. Check users table RLS policy or use a server-side service role key." });
  }

  res.status(500).json({ error: "Database error" });
}

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const username = (req.body.username || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.json({ success: true, isAdmin: true, username });
    }

    const user = await getUser(username);

    if (!user || user.password !== password) {
      return res.status(403).json({ error: "Wrong username or password" });
    }

    res.json({ success: true, isAdmin: false, username });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// ADMIN: list users
app.get('/api/admin/users', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const users = await listUsers();
    const list = [
      { username: ADMIN_USERNAME, displayName: "Admin", isAdmin: true },
      ...users
        .filter((user) => user.username !== ADMIN_USERNAME)
        .map((user) => ({
          username: user.username,
          displayName: user.displayName || user.username,
          isAdmin: false
        }))
    ];

    res.json({ users: list });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// ADMIN: create user
app.post('/api/admin/users', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const username = (req.body.username || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (username === ADMIN_USERNAME || await getUser(username)) {
      return res.status(409).json({ error: "Username already exists" });
    }

    await createUser(username, password);
    res.json({ success: true });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// ADMIN: change password
app.post('/api/admin/users/:username/password', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const username = req.params.username.toLowerCase();
    const password = (req.body.password || "").trim();

    if (username === ADMIN_USERNAME) {
      return res.status(403).json({ error: "Admin password is fixed" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await updateUser(username, { password });
    res.json({ success: true });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// ADMIN: delete user
app.delete('/api/admin/users/:username', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  try {
    const username = req.params.username.toLowerCase();

    if (username === ADMIN_USERNAME) {
      return res.status(403).json({ error: "Admin user cannot be deleted" });
    }

    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await deleteUser(username);
    res.json({ success: true });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// GET user
app.get('/api/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await getUser(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// UPDATE user
app.post('/api/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await getUser(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, bio, links, avatar, displayName, newPassword } = req.body;

    if (user.password !== password) {
      return res.status(403).json({ error: "Wrong password" });
    }

    const updates = {
      bio: bio || "",
      links: sanitizeLinks(links)
    };

    if (displayName !== undefined) {
      updates.displayname = displayName;
    }

    if (avatar !== undefined) {
      updates.avatar = avatar;
    }

    if (newPassword !== undefined) {
      const cleanPassword = String(newPassword).trim();
      if (!cleanPassword) {
        return res.status(400).json({ error: "Password is required" });
      }

      updates.password = cleanPassword;
    }

    await updateUser(username, updates);
    res.json({ success: true });
  } catch (error) {
    sendSupabaseError(res, error);
  }
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
