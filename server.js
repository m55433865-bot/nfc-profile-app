require('dotenv').config(); //added for .env
const express = require('express');
const path = require('path');
const browserSync = require('browser-sync').create();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;
const BASE_PATH = "/nfc";
const publicDir = path.join(__dirname, "public");
const ADMIN_USERNAME = "66546788";
const ADMIN_PASSWORD = "123";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://icxhlqummrtfpxzegbvd.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeGhscXVtbXJ0ZnB4emVnYnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjYyODQsImV4cCI6MjA5Mzc0MjI4NH0.15teqmpk7adjnANdLAWlrmfTJDRlXyGhiy-JiNqWnSI";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
  : null;
const supabaseServer = supabaseAdmin || supabaseAnon;

app.use(express.json({ limit: '10mb' }));
app.use(BASE_PATH, express.static(publicDir));
app.use(express.static(publicDir));

function sanitizeLinks(links) {
  return Array.isArray(links)
    ? links.filter((link) => link && link.name && link.url)
    : [];
}

const DEFAULT_THEME = {
  mode: "dark",
  preset: "midnight",
  accent: "#00c896"
};

function sanitizeTheme(theme) {
  if (!theme || typeof theme !== "object") return { ...DEFAULT_THEME };

  const allowedModes = new Set(["dark", "light", "system"]);
  const allowedPresets = new Set(["midnight", "ocean", "purple", "gold", "forest", "minimal-white", "neon"]);
  const safeAccent = /^#[0-9a-f]{6}$/i.test(theme.accent || "") ? theme.accent : DEFAULT_THEME.accent;

  return {
    mode: allowedModes.has(theme.mode) ? theme.mode : DEFAULT_THEME.mode,
    preset: allowedPresets.has(theme.preset) ? theme.preset : DEFAULT_THEME.preset,
    accent: safeAccent
  };
}

function redactUpdatesForLog(updates) {
  return {
    ...updates,
    ...(updates.password ? { password: "[redacted]" } : {})
  };
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
    links: sanitizeLinks(row.links),
    theme: sanitizeTheme(row.theme)
  };
}

async function getUser(username, client = supabaseServer) {
  const cleanUsername = username.toLowerCase();
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('username', cleanUsername)
    .maybeSingle();

  if (error) throw error;
  return normalizeUser(data);
}

async function listUsers(client = supabaseServer) {
  const { data, error } = await client
    .from('users')
    .select('*')
    .order('username', { ascending: true });

  if (error) throw error;
  return (data || []).map(normalizeUser);
}

function buildCreateUserPayload(username, password) {
  return {
    username,
    password,
    displayname: username,
    bio: "",
    avatar: "",
    links: [],
    theme: DEFAULT_THEME
  };
}

async function createUser(username, password, client = supabaseServer) {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();
  const payload = buildCreateUserPayload(cleanUsername, cleanPassword);

  const { error } = await client
    .from('users')
    .insert(payload);

  if (error) {
    error.insertPayload = {
      ...payload,
      password: "[redacted]"
    };
    throw error;
  }
}

async function updateUser(username, updates, client = supabaseServer) {
  const cleanUsername = username.toLowerCase();
  console.log("Supabase update payload", {
    username: cleanUsername,
    updates: redactUpdatesForLog(updates)
  });

  const { data, error } = await client
    .from('users')
    .update(updates)
    .eq('username', cleanUsername)
    .select('*')
    .single();

  console.log("update result:", data);
  console.log("update error:", error);

  if (error) throw error;

  return normalizeUser(data);
}

async function deleteUser(username, client = supabaseServer) {
  const { error } = await client
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

function requireServiceRole(res) {
  if (!supabaseAdmin) {
    res.status(500).json({ error: "SUPABASE_SERVICE_ROLE_KEY is required for admin user management" });
    return false;
  }

  return true;
}

function sendSupabaseError(res, error) {
  console.error("Supabase backend error", {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: error.status,
    insertPayload: error.insertPayload
  });

  if (error.code === "23505") {
    return res.status(409).json({ error: "Username already exists" });
  }

  if (error.code === "42501") {
    return res.status(403).json({ error: "Permission denied" });
  }

  res.status(500).json({
    error: error.message || "Database error",
    code: error.code,
    details: error.details,
    hint: error.hint
  });
}

const apiRouter = express.Router();

// LOGIN
apiRouter.post('/login', async (req, res) => {
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
apiRouter.get('/admin/users', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (!requireServiceRole(res)) return;

  try {
    const users = await listUsers(supabaseAdmin);
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
apiRouter.post('/admin/users', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (!requireServiceRole(res)) return;

  try {
    const username = (req.body.username || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (username === ADMIN_USERNAME || await getUser(username, supabaseAdmin)) {
      return res.status(409).json({ error: "Username already exists" });
    }

    await createUser(username, password, supabaseAdmin);
    res.json({ success: true });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// ADMIN: change password
apiRouter.post('/admin/users/:username/password', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (!requireServiceRole(res)) return;

  try {
    const username = req.params.username.toLowerCase();
    const password = (req.body.password || "").trim();

    if (username === ADMIN_USERNAME) {
      return res.status(403).json({ error: "Admin password is fixed" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await getUser(username, supabaseAdmin);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await updateUser(username, { password }, supabaseAdmin);
    res.json({ success: true });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// ADMIN: delete user
apiRouter.delete('/admin/users/:username', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (!requireServiceRole(res)) return;

  try {
    const username = req.params.username.toLowerCase();

    if (username === ADMIN_USERNAME) {
      return res.status(403).json({ error: "Admin user cannot be deleted" });
    }

    const user = await getUser(username, supabaseAdmin);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await deleteUser(username, supabaseAdmin);
    res.json({ success: true });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// GET user
apiRouter.get('/:username', async (req, res) => {
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

// UPDATE user theme
apiRouter.post('/:username/theme', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const theme = req.body ? req.body.theme : undefined;

    console.log("theme received:", theme);

    if (!theme) {
      return res.status(400).json({ error: "Theme is required" });
    }

    const user = await getUser(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== (req.body.password || "")) {
      return res.status(403).json({ error: "Wrong password" });
    }

    const safeTheme = sanitizeTheme(theme);
    const { data, error } = await supabaseServer
      .from("users")
      .update({ theme: safeTheme })
      .eq("username", username)
      .select("theme")
      .single();

    console.log("update result:", data);
    console.log("update error:", error);

    if (error) {
      return res.status(500).json({
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }

    res.json({ success: true, theme: sanitizeTheme(data.theme) });
  } catch (error) {
    console.log("update error:", error);
    res.status(500).json({
      error: error.message || "Theme update failed",
      code: error.code,
      details: error.details,
      hint: error.hint
    });
  }
});

// UPDATE user
apiRouter.post('/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await getUser(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, bio, links, avatar, displayName, newPassword, theme } = req.body;
    console.log("theme received:", req.body.theme);

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

    if (theme !== undefined) {
      updates.theme = sanitizeTheme(theme);
    }

    if (newPassword !== undefined) {
      const cleanPassword = String(newPassword).trim();
      if (!cleanPassword) {
        return res.status(400).json({ error: "Password is required" });
      }

      updates.password = cleanPassword;
    }

    const updatedUser = await updateUser(username, updates);
    console.log("Updated user theme", {
      username,
      theme: updatedUser ? updatedUser.theme : null
    });
    res.json({ success: true, user: updatedUser, theme: updatedUser.theme });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

app.use('/api', apiRouter);
app.use(`${BASE_PATH}/api`, apiRouter);

// page
app.get('/', (req, res) => {
  res.redirect(`${BASE_PATH}/login`);
});

app.get(`${BASE_PATH}`, (req, res) => {
  res.redirect(`${BASE_PATH}/login`);
});

app.get(`${BASE_PATH}/login`, (req, res) => {
  res.sendFile(path.join(publicDir, 'login.html'));
});

app.get(`${BASE_PATH}/admin`, (req, res) => {
  res.sendFile(path.join(publicDir, 'admin.html'));
});

app.get(`${BASE_PATH}/profile/:username`, (req, res) => {
  res.sendFile(path.join(publicDir, 'edit.html'));
});

app.get(`${BASE_PATH}/:username`, (req, res) => {
  res.redirect(`${BASE_PATH}/profile/${encodeURIComponent(req.params.username)}`);
});

app.get('/login', (req, res) => {
  res.redirect(`${BASE_PATH}/login`);
});

app.get('/admin', (req, res) => {
  res.redirect(`${BASE_PATH}/admin`);
});

app.get('/profile/:username', (req, res) => {
  res.redirect(`${BASE_PATH}/profile/${encodeURIComponent(req.params.username)}`);
});

app.get('/:username', (req, res) => {
  res.redirect(`${BASE_PATH}/profile/${encodeURIComponent(req.params.username)}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  browserSync.init({
    proxy: `http://localhost:${PORT}`,
    files: ["public/**/*.*"],
    open: false
  });
});
