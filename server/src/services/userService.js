// services/userService.js
// Semua query SQL untuk tabel users. Nilai dikirim lewat placeholder (?).

import pool from "../config/db.js";

const PUBLIC_COLUMNS = "id, fullname, username, email, is_verified, created_at";

// INSERT user baru. password harus sudah berupa hash bcrypt.
// Mengembalikan id user yang baru dibuat.
export async function insertUser({
  fullname,
  username,
  email,
  passwordHash,
  verificationToken,
}) {
  const [result] = await pool.execute(
    "INSERT INTO users (fullname, username, email, password, verification_token) VALUES (?, ?, ?, ?, ?)",
    [fullname, username, email, passwordHash, verificationToken]
  );
  return result.insertId;
}

// Data user tanpa password dan tanpa token (aman dikirim ke klien).
export async function selectUserById(id) {
  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

// Dipakai login: menyertakan hash password.
export async function selectUserByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT id, fullname, username, email, password, is_verified FROM users WHERE email = ?",
    [email]
  );
  return rows[0] ?? null;
}

export async function selectUserByVerificationToken(token) {
  const [rows] = await pool.execute(
    "SELECT id FROM users WHERE verification_token = ?",
    [token]
  );
  return rows[0] ?? null;
}

// Menandai email terverifikasi dan menghapus token agar tidak bisa dipakai lagi.
export async function markEmailVerified(id) {
  await pool.execute(
    "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
    [id]
  );
}

export async function deleteUserById(id) {
  const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows;
}
