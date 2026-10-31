// controllers/authController.js
// Registrasi, login, dan verifikasi email.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/auth.js";
import { validateRegister, validateLogin } from "../validators/userValidator.js";
import {
  insertUser,
  selectUserById,
  selectUserByEmail,
  selectUserByVerificationToken,
  markEmailVerified,
  deleteUserById,
} from "../services/userService.js";
import { sendVerificationEmail } from "../services/mailService.js";

// Tingkat biaya bcrypt: makin besar makin lambat dan makin sulit ditebak.
const SALT_ROUNDS = 12;

// Hash palsu: dipakai saat email tidak ditemukan supaya waktu respons tetap
// mirip dengan kasus password salah (mempersulit penebakan email terdaftar).
const DUMMY_HASH = await bcrypt.hash("password-palsu-untuk-penyamaan-waktu", SALT_ROUNDS);

function toPublicUser(user) {
  return {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    is_verified: Boolean(user.is_verified),
  };
}

// POST /register
export async function register(req, res) {
  const { errors, data } = validateRegister(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ status: "error", message: errors.join(" ") });
  }

  // Password dienkripsi (hash) sebelum disimpan. Password asli tidak disimpan.
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const verificationToken = uuidv4();

  let newId;
  try {
    newId = await insertUser({
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      passwordHash,
      verificationToken,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      const message = String(err.message);
      if (message.includes("uq_users_username")) {
        return res.status(409).json({ status: "error", message: "Username sudah terdaftar." });
      }
      if (message.includes("uq_users_email")) {
        return res.status(409).json({ status: "error", message: "Email sudah terdaftar." });
      }
    }
    throw err;
  }

  try {
    await sendVerificationEmail({
      to: data.email,
      fullname: data.fullname,
      token: verificationToken,
    });
  } catch (err) {
    // Email gagal terkirim: batalkan registrasi supaya pengguna bisa mencoba lagi.
    await deleteUserById(newId);
    console.error("Gagal mengirim email verifikasi:", err.message);
    return res.status(502).json({
      status: "error",
      message: "Registrasi dibatalkan karena email verifikasi gagal dikirim. Coba lagi nanti.",
    });
  }

  const user = await selectUserById(newId);
  res.status(201).json({
    status: "success",
    message: "Registrasi berhasil. Silakan cek email Anda untuk verifikasi.",
    data: toPublicUser(user),
  });
}

// POST /login
export async function login(req, res) {
  const { errors, data } = validateLogin(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ status: "error", message: errors.join(" ") });
  }

  const user = await selectUserByEmail(data.email);

  // 1. Email tidak ditemukan -> 401 Unauthorized (pesan sengaja dibuat umum).
  if (!user) {
    await bcrypt.compare(data.password, DUMMY_HASH);
    return res.status(401).json({ status: "error", message: "email atau password salah" });
  }

  // 2. Bandingkan password dengan hash di database.
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    return res.status(401).json({ status: "error", message: "email atau password salah" });
  }

  // 3. Email dan password cocok -> buat token JWT.
  const token = jwt.sign(
    { sub: String(user.id), email: user.email, username: user.username },
    JWT_SECRET,
    { algorithm: "HS256", expiresIn: JWT_EXPIRES_IN }
  );

  res.status(200).json({
    status: "success",
    message: "Login berhasil.",
    token,
    data: toPublicUser(user),
  });
}

// GET /verify-email?token=...
export async function verifyEmail(req, res) {
  const { token } = req.query;

  if (typeof token !== "string" || token.length !== 36) {
    return res.status(400).json({ status: "error", message: "Invalid verification token" });
  }

  const user = await selectUserByVerificationToken(token);
  if (!user) {
    return res.status(400).json({ status: "error", message: "Invalid verification token" });
  }

  await markEmailVerified(user.id);
  res.status(200).json({ status: "success", message: "Email verified successfully" });
}
