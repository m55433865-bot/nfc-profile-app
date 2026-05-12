require('dotenv').config(); //added for .env
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const browserSync = require('browser-sync').create();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;
const BASE_PATH = "/nfc";
const publicDir = path.join(__dirname, "public");
const ADMIN_USERNAME = "66546788";
const ADMIN_EMAIL = "66546788@yourteck.com";
const ADMIN_PASSWORD = "yourteck@66546788";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://icxhlqummrtfpxzegbvd.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeGhscXVtbXJ0ZnB4emVnYnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNjYyODQsImV4cCI6MjA5Mzc0MjI4NH0.15teqmpk7adjnANdLAWlrmfTJDRlXyGhiy-JiNqWnSI";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_AUTH_SECRET = process.env.GOOGLE_AUTH_SECRET || "";
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
    ? links
      .filter((link) => link && link.name && link.url)
      .map((link) => ({
        ...link,
        customIcon: typeof link.customIcon === "string" && link.customIcon.startsWith("data:image/")
          ? link.customIcon
          : ""
      }))
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

function safeScriptJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

async function sendProfilePage(req, res) {
  const username = (req.params.username || "").toLowerCase();
  let initialTheme = null;

  try {
    const user = await getUser(username);
    if (user) {
      initialTheme = user.theme;
    }
  } catch (error) {
    console.error("Initial profile theme load failed", {
      username,
      message: error.message,
      code: error.code
    });
  }

  try {
    const html = await fs.readFile(path.join(publicDir, "edit.html"), "utf8");
    const themedHtml = html.replace(
      "window.__INITIAL_PROFILE_THEME__ = null;",
      `window.__INITIAL_PROFILE_THEME__ = ${safeScriptJson(initialTheme)};`
    );
    res.type("html").send(themedHtml);
  } catch (error) {
    console.error("Profile page read failed", error);
    res.status(500).send("Profile page unavailable");
  }
}

function normalizeUser(row) {
  if (!row) return null;

  const username = (row.username || "").toLowerCase();

  return {
    id: row.id,
    username,
    email: row.email || "",
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

async function getUserByEmail(email, client = supabaseServer) {
  const cleanEmail = email.toLowerCase();
  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('email', cleanEmail)
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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function isMissingEmailColumnError(error) {
  const text = [
    error?.message,
    error?.details,
    error?.hint
  ].filter(Boolean).join(" ").toLowerCase();

  return text.includes("'email' column") ||
    text.includes('"email" column') ||
    text.includes("email column") ||
    text.includes("could not find") && text.includes("email") && text.includes("schema cache");
}

function buildCreateUserPayload(username, password, email = "") {
  return {
    username,
    email: String(email || "").trim().toLowerCase(),
    password,
    displayname: username,
    bio: "",
    avatar: "",
    links: [],
    theme: DEFAULT_THEME
  };
}

function withoutEmail(payload) {
  const copy = { ...payload };
  delete copy.email;
  return copy;
}

function buildGooglePassword(googleSub) {
  if (!GOOGLE_AUTH_SECRET) {
    throw new Error("GOOGLE_AUTH_SECRET is required for Google login");
  }

  return `google:${crypto
    .createHmac("sha256", GOOGLE_AUTH_SECRET)
    .update(String(googleSub))
    .digest("hex")}`;
}

function normalizeGoogleUsername(value) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/@.*/, "")
    .replace(/[^a-z0-9]/g, "");

  return clean || "user";
}

function buildGoogleUsernameCandidates(profile) {
  const emailBase = normalizeGoogleUsername(profile.email);
  const nameBase = normalizeGoogleUsername(profile.name);
  const suffix = String(profile.sub || "").replace(/\D/g, "").slice(-6) || crypto
    .createHash("sha256")
    .update(String(profile.sub || profile.email || "google"))
    .digest("hex")
    .slice(0, 6);
  const candidates = [
    emailBase,
    nameBase,
    `${emailBase}${suffix}`,
    `google${suffix}`
  ];

  return [...new Set(candidates)]
    .filter((candidate) => candidate && candidate !== ADMIN_USERNAME)
    .map((candidate) => candidate.slice(0, 32));
}

async function verifyGoogleIdToken(credential) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is required for Google login");
  }

  const token = String(credential || "").trim();
  if (!token) {
    const error = new Error("Google credential is required");
    error.status = 400;
    throw error;
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
  const profile = await response.json().catch(() => null);

  if (!response.ok || !profile) {
    const error = new Error(profile?.error_description || "Google token verification failed");
    error.status = 401;
    throw error;
  }

  const validIssuer = profile.iss === "accounts.google.com" || profile.iss === "https://accounts.google.com";
  const validAudience = profile.aud === GOOGLE_CLIENT_ID;
  const notExpired = Number(profile.exp || 0) > Math.floor(Date.now() / 1000);
  const emailVerified = profile.email_verified === true || profile.email_verified === "true";

  if (!validIssuer || !validAudience || !notExpired || !emailVerified || !profile.sub || !profile.email) {
    const error = new Error("Invalid Google account token");
    error.status = 401;
    throw error;
  }

  return {
    sub: profile.sub,
    email: profile.email,
    name: profile.name || profile.email.split("@")[0],
    picture: profile.picture || ""
  };
}

async function createUser(username, password, client = supabaseServer, email = "") {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const payload = buildCreateUserPayload(cleanUsername, cleanPassword, cleanEmail);

  let { error } = await client
    .from('users')
    .insert(payload);

  if (error && cleanEmail && isMissingEmailColumnError(error)) {
    console.warn("users.email column is missing; creating user without storing email. Run the Supabase email migration.");
    const retry = await client
      .from('users')
      .insert(withoutEmail(payload));
    error = retry.error;
  }

  if (error) {
    error.insertPayload = {
      ...payload,
      password: "[redacted]"
    };
    throw error;
  }
}

async function createGoogleUser(username, password, profile, client = supabaseServer) {
  const cleanUsername = username.trim().toLowerCase();
  const payload = {
    ...buildCreateUserPayload(cleanUsername, password, profile.email),
    displayname: cleanUsername
  };

  let { data, error } = await client
    .from('users')
    .insert(payload)
    .select('*')
    .single();

  if (error && profile.email && isMissingEmailColumnError(error)) {
    console.warn("users.email column is missing; creating Google user without storing email. Run the Supabase email migration.");
    const retry = await client
      .from('users')
      .insert(withoutEmail(payload))
      .select('*')
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    error.insertPayload = {
      ...payload,
      password: "[redacted]"
    };
    throw error;
  }

  return normalizeUser(data);
}

async function findOrCreateGoogleUser(profile) {
  if (!supabaseAdmin) {
    const error = new Error("SUPABASE_SERVICE_ROLE_KEY is required for Google user creation");
    error.status = 500;
    throw error;
  }

  const password = buildGooglePassword(profile.sub);
  const candidates = buildGoogleUsernameCandidates(profile);

  for (const candidate of candidates) {
    const existing = await getUser(candidate, supabaseAdmin);
    if (existing && existing.password === password) {
      if (!existing.email && profile.email) {
        try {
          const updatedUser = await updateUser(candidate, { email: profile.email.toLowerCase() }, supabaseAdmin);
          return { user: updatedUser, password, created: false };
        } catch (error) {
          if (!isMissingEmailColumnError(error)) throw error;
          console.warn("users.email column is missing; Google login will continue without storing email.");
        }
      }

      return { user: existing, password, created: false };
    }
  }

  for (const candidate of candidates) {
    const existing = await getUser(candidate, supabaseAdmin);
    if (!existing) {
      const user = await createGoogleUser(candidate, password, profile, supabaseAdmin);
      return { user, password, created: true };
    }
  }

  const error = new Error("Could not create a unique username for this Google account");
  error.status = 409;
  throw error;
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

  if (error.status) {
    return res.status(error.status).json({ error: error.message || "Request failed" });
  }

  res.status(500).json({
    error: error.message || "Database error",
    code: error.code,
    details: error.details,
    hint: error.hint
  });
}

const apiRouter = express.Router();

// LOGIN - Email based
apiRouter.post('/login', async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.json({ success: true, isAdmin: true, email, username: ADMIN_USERNAME });
    }

    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      return res.status(403).json({ error: "Wrong email or password" });
    }

    res.json({ success: true, isAdmin: false, email, username: user.username });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// Get current user (email-based auth)
apiRouter.post('/auth/user', async (req, res) => {
  try {
    // This endpoint expects the email from the frontend
    // In a production app, you'd use session/JWT tokens instead
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password && user.password !== password) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    res.json({ 
      success: true, 
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      bio: user.bio,
      avatar: user.avatar,
      links: user.links,
      theme: user.theme
    });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// GET current user endpoint (called from profile routing)
apiRouter.get('/auth/user', async (req, res) => {
  try {
    // This is a public endpoint that just returns success
    // The frontend determines routing based on profile existence
    res.json({ success: true });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

// SIGNUP - Email based, generates temporary username
apiRouter.post('/signup', async (req, res) => {
  if (!requireServiceRole(res)) return;

  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    if (password.length < 3) {
      return res.status(400).json({ error: "Password must be at least 3 characters" });
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email, supabaseAdmin);
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Generate a temporary username from email (user will set display name + profile slug in onboarding)
    const emailBase = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'user';
    const suffix = Math.random().toString(36).substring(2, 8);
    const tempUsername = `${emailBase}${suffix}`.slice(0, 32);

    // Create user with temporary username and email
    const user = await createUser(tempUsername, password, supabaseAdmin, email);
    res.json({ success: true, username: user.username, email: user.email });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

apiRouter.get('/auth/google/config', (req, res) => {
  res.json({
    enabled: Boolean(GOOGLE_CLIENT_ID),
    clientId: GOOGLE_CLIENT_ID
  });
});

apiRouter.post('/auth/google', async (req, res) => {
  try {
    const profile = await verifyGoogleIdToken(req.body.credential);
    const { user, password, created } = await findOrCreateGoogleUser(profile);

    res.json({
      success: true,
      isAdmin: false,
      provider: "google",
      created,
      username: user.username,
      email: user.email || profile.email,
      password,
      user
    });
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

app.get(`${BASE_PATH}/onboarding`, (req, res) => {
  res.sendFile(path.join(publicDir, 'onboarding.html'));
});

app.get(`${BASE_PATH}/profile/:username`, sendProfilePage);

app.get(`${BASE_PATH}/:username`, (req, res) => {
  res.redirect(`${BASE_PATH}/profile/${encodeURIComponent(req.params.username)}`);
});

app.get('/login', (req, res) => {
  res.redirect(`${BASE_PATH}/login`);
});

app.get('/admin', (req, res) => {
  res.redirect(`${BASE_PATH}/admin`);
});

app.get('/onboarding', (req, res) => {
  res.redirect(`${BASE_PATH}/onboarding`);
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
