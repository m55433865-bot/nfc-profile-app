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
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "";
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
const VERIFICATION_RESEND_COOLDOWN_MS = 60 * 1000;
const VERIFICATION_MAX_ATTEMPTS = 6;
const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;
const PASSWORD_RESET_COOLDOWN_MS = 60 * 1000;
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
const pendingEmailSignups = new Map();

app.set("trust proxy", true);
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
  const allowedPresets = new Set([
    "midnight",
    "ocean",
    "purple",
    "gold",
    "forest",
    "minimal-white",
    "rose",
    "neon",
    "aurora",
    "galaxy",
    "sunset-gradient",
    "candy",
    "fire",
    "ice"
  ]);
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

  let { data, error } = await client
    .from('users')
    .insert(payload)
    .select('*')
    .single();

  if (error && cleanEmail && isMissingEmailColumnError(error)) {
    console.warn("users.email column is missing; creating user without storing email. Run the Supabase email migration.");
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

function createTempUsername(email) {
  const emailBase = String(email || "")
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') || 'user';
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${emailBase}${suffix}`.slice(0, 32);
}

function getVerificationSecret() {
  return GOOGLE_AUTH_SECRET || SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
}

function hashVerificationCode(email, code) {
  return crypto
    .createHmac("sha256", getVerificationSecret())
    .update(`${String(email || "").trim().toLowerCase()}:${String(code || "").trim()}`)
    .digest("hex");
}

function generateVerificationCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

function cleanupExpiredVerificationCodes() {
  const now = Date.now();
  for (const [email, record] of pendingEmailSignups.entries()) {
    if (!record || record.expiresAt <= now) {
      pendingEmailSignups.delete(email);
    }
  }
}

function getVerificationCooldown(record) {
  if (!record || !record.lastSentAt) return 0;
  const remaining = VERIFICATION_RESEND_COOLDOWN_MS - (Date.now() - record.lastSentAt);
  return Math.max(0, Math.ceil(remaining / 1000));
}

async function sendVerificationEmail(email, code) {
  if (!RESEND_API_KEY || !EMAIL_FROM) {
    const error = new Error("Email verification is not configured");
    error.status = 500;
    throw error;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [email],
      subject: "Your YourTeck verification code",
      html: `
        <div style="font-family:Arial,sans-serif;background:#0f0f0f;color:#ffffff;padding:28px;">
          <div style="max-width:440px;margin:0 auto;background:#1f1f1f;border:1px solid #333;border-radius:16px;padding:24px;">
            <h1 style="font-size:22px;margin:0 0 10px;">Verify your email</h1>
            <p style="color:#bdbdbd;margin:0 0 18px;">Use this code to finish creating your YourTeck NFC profile.</p>
            <div style="font-size:34px;letter-spacing:8px;font-weight:700;color:#00c896;background:#141414;border:1px solid #333;border-radius:12px;padding:16px;text-align:center;">${code}</div>
            <p style="color:#888;font-size:13px;margin:18px 0 0;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
          </div>
        </div>
      `,
      text: `Your YourTeck verification code is ${code}. It expires in 10 minutes.`
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    const error = new Error(details || "Verification email could not be sent");
    error.status = 502;
    throw error;
  }
}

function getAppBaseUrl(req) {
  const host = req.get("host") || "localhost:3000";
  const forwardedProto = String(req.get("x-forwarded-proto") || "").split(",")[0].trim();
  const protocol = host.includes("localhost") || host.startsWith("127.0.0.1")
    ? "http"
    : (forwardedProto || "https");
  return `${protocol}://${host}${BASE_PATH}`;
}

function generatePasswordResetToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function hashPasswordResetToken(token) {
  return crypto
    .createHash("sha256")
    .update(String(token || ""))
    .digest("hex");
}

function getIsoDateFromNow(ms) {
  return new Date(Date.now() + ms).toISOString();
}

async function sendPasswordResetEmail(email, resetUrl) {
  if (!RESEND_API_KEY || !EMAIL_FROM) {
    const error = new Error("Password reset email is not configured");
    error.status = 500;
    throw error;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [email],
      subject: "Reset your YourTeck password",
      html: `
        <div style="font-family:Arial,sans-serif;background:#0f0f0f;color:#ffffff;padding:28px;">
          <div style="max-width:460px;margin:0 auto;background:#1f1f1f;border:1px solid #333;border-radius:16px;padding:24px;">
            <h1 style="font-size:22px;margin:0 0 10px;">Reset your password</h1>
            <p style="color:#bdbdbd;margin:0 0 18px;">Use this secure link to choose a new password for your YourTeck NFC profile.</p>
            <a href="${resetUrl}" style="display:block;background:#00c896;color:#07110e;text-decoration:none;font-weight:700;border-radius:12px;padding:14px 16px;text-align:center;">Reset password</a>
            <p style="color:#888;font-size:13px;margin:18px 0 0;">This link expires in 30 minutes. If you did not request it, you can ignore this email.</p>
          </div>
        </div>
      `,
      text: `Reset your YourTeck password: ${resetUrl}\n\nThis link expires in 30 minutes.`
    })
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    const error = new Error(details || "Password reset email could not be sent");
    error.status = 502;
    throw error;
  }
}

async function createPasswordResetToken(user, req) {
  const token = generatePasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);
  const email = String(user.email || "").trim().toLowerCase();
  const resetUrl = `${getAppBaseUrl(req)}/reset-password?token=${encodeURIComponent(token)}`;

  const { error: updateError } = await supabaseAdmin
    .from("password_reset_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("email", email)
    .is("used_at", null);

  if (updateError) throw updateError;

  const { error } = await supabaseAdmin
    .from("password_reset_tokens")
    .insert({
      user_id: user.id,
      email,
      token_hash: tokenHash,
      expires_at: getIsoDateFromNow(PASSWORD_RESET_TTL_MS)
    });

  if (error) throw error;

  await sendPasswordResetEmail(email, resetUrl);
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

apiRouter.post('/password-reset/request', async (req, res) => {
  if (!requireServiceRole(res)) return;

  const genericResponse = {
    success: true,
    message: "If an account exists, we sent a reset link."
  };

  try {
    const email = (req.body.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    const user = await getUserByEmail(email, supabaseAdmin);
    if (!user || !user.email || String(user.password || "").startsWith("google:")) {
      return res.json(genericResponse);
    }

    const cooldownSince = new Date(Date.now() - PASSWORD_RESET_COOLDOWN_MS).toISOString();
    const { data: recentToken, error: recentError } = await supabaseAdmin
      .from("password_reset_tokens")
      .select("created_at")
      .eq("email", email)
      .gte("created_at", cooldownSince)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentError) throw recentError;

    if (!recentToken) {
      await createPasswordResetToken(user, req);
    }

    res.json(genericResponse);
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

apiRouter.post('/password-reset/complete', async (req, res) => {
  if (!requireServiceRole(res)) return;

  try {
    const token = String(req.body.token || "").trim();
    const password = String(req.body.password || "").trim();

    if (!token || !password) {
      return res.status(400).json({ error: "Reset token and new password are required" });
    }

    if (password.length < 3) {
      return res.status(400).json({ error: "Password must be at least 3 characters" });
    }

    const tokenHash = hashPasswordResetToken(token);
    const { data: resetToken, error } = await supabaseAdmin
      .from("password_reset_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .is("used_at", null)
      .maybeSingle();

    if (error) throw error;

    if (!resetToken || new Date(resetToken.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({ error: "Reset link is invalid or expired. Please request a new one." });
    }

    const user = await getUserByEmail(resetToken.email, supabaseAdmin);
    if (!user || String(user.password || "").startsWith("google:")) {
      return res.status(400).json({ error: "Reset link is invalid or expired. Please request a new one." });
    }

    await updateUser(user.username, { password }, supabaseAdmin);

    const { error: usedError } = await supabaseAdmin
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", resetToken.id);

    if (usedError) throw usedError;

    res.json({ success: true });
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
      id: user.id,
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

// SIGNUP - Email based, sends verification code before creating account
apiRouter.post('/signup', async (req, res) => {
  if (!requireServiceRole(res)) return;

  try {
    cleanupExpiredVerificationCodes();

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

    const existingPending = pendingEmailSignups.get(email);
    const cooldownSeconds = getVerificationCooldown(existingPending);
    if (cooldownSeconds > 0) {
      return res.status(429).json({
        error: `Please wait ${cooldownSeconds}s before requesting another code`,
        cooldownSeconds
      });
    }

    const code = generateVerificationCode();
    await sendVerificationEmail(email, code);

    pendingEmailSignups.set(email, {
      codeHash: hashVerificationCode(email, code),
      expiresAt: Date.now() + VERIFICATION_CODE_TTL_MS,
      lastSentAt: Date.now(),
      attempts: 0
    });

    res.json({
      success: true,
      verificationRequired: true,
      email,
      expiresInSeconds: Math.floor(VERIFICATION_CODE_TTL_MS / 1000),
      cooldownSeconds: Math.floor(VERIFICATION_RESEND_COOLDOWN_MS / 1000)
    });
  } catch (error) {
    sendSupabaseError(res, error);
  }
});

apiRouter.post('/signup/verify', async (req, res) => {
  if (!requireServiceRole(res)) return;

  try {
    cleanupExpiredVerificationCodes();

    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();
    const code = String(req.body.code || "").trim();

    if (!email || !password || !code) {
      return res.status(400).json({ error: "Email, password, and verification code are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }

    if (password.length < 3) {
      return res.status(400).json({ error: "Password must be at least 3 characters" });
    }

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: "Enter the 6-digit verification code" });
    }

    const record = pendingEmailSignups.get(email);
    if (!record) {
      return res.status(400).json({ error: "Verification code expired. Please request a new code." });
    }

    if (record.expiresAt <= Date.now()) {
      pendingEmailSignups.delete(email);
      return res.status(400).json({ error: "Verification code expired. Please request a new code." });
    }

    if (record.attempts >= VERIFICATION_MAX_ATTEMPTS) {
      pendingEmailSignups.delete(email);
      return res.status(429).json({ error: "Too many incorrect attempts. Please request a new code." });
    }

    const expectedHash = record.codeHash;
    const receivedHash = hashVerificationCode(email, code);
    const isCorrect = crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(receivedHash));

    if (!isCorrect) {
      record.attempts += 1;
      pendingEmailSignups.set(email, record);
      return res.status(400).json({ error: "Incorrect verification code" });
    }

    const existingUser = await getUserByEmail(email, supabaseAdmin);
    if (existingUser) {
      pendingEmailSignups.delete(email);
      return res.status(409).json({ error: "Email already exists" });
    }

    const tempUsername = createTempUsername(email);
    const user = await createUser(tempUsername, password, supabaseAdmin, email);
    pendingEmailSignups.delete(email);

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
      {
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        displayName: "Admin",
        links: [],
        isAdmin: true
      },
      ...users
        .filter((user) => user.username !== ADMIN_USERNAME)
        .map((user) => ({
          username: user.username,
          email: user.email || "",
          displayName: user.displayName || user.username,
          links: sanitizeLinks(user.links),
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

    // Create user with temporary username and email
    await createUser(createTempUsername(email), password, supabaseAdmin, email);
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

app.get(`${BASE_PATH}/reset-password`, (req, res) => {
  res.sendFile(path.join(publicDir, 'reset-password.html'));
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

app.get('/reset-password', (req, res) => {
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  res.redirect(`${BASE_PATH}/reset-password${query}`);
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
