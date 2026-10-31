// validators/userValidator.js
// Memeriksa payload registrasi dan login sebelum diproses.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;

// bcrypt hanya memakai 72 byte pertama dari password. Batas ini mencegah
// password yang lebih panjang terpotong tanpa sepengetahuan pengguna.
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_BYTES = 72;

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

export function validateRegister(body) {
  const errors = [];
  const data = {};
  const input = body && typeof body === "object" ? body : {};

  const fullname = typeof input.fullname === "string" ? input.fullname.trim() : "";
  if (fullname.length < 2 || fullname.length > 100) {
    errors.push("fullname wajib diisi (2 sampai 100 karakter).");
  } else {
    data.fullname = fullname;
  }

  const username = typeof input.username === "string" ? input.username.trim() : "";
  if (!USERNAME_REGEX.test(username)) {
    errors.push(
      "username wajib diisi: 3 sampai 30 karakter, hanya huruf, angka, dan garis bawah (_)."
    );
  } else {
    data.username = username;
  }

  const email = typeof input.email === "string" ? normalizeEmail(input.email) : "";
  if (email.length > 255 || !EMAIL_REGEX.test(email)) {
    errors.push("email wajib diisi dengan format yang valid.");
  } else {
    data.email = email;
  }

  const password = typeof input.password === "string" ? input.password : "";
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES
  ) {
    errors.push("password wajib diisi: minimal 8 karakter dan maksimal 72 byte.");
  } else {
    data.password = password;
  }

  return { errors, data };
}

export function validateLogin(body) {
  const errors = [];
  const data = {};
  const input = body && typeof body === "object" ? body : {};

  if (typeof input.email !== "string" || input.email.trim() === "") {
    errors.push("email wajib diisi.");
  } else {
    data.email = normalizeEmail(input.email);
  }

  if (typeof input.password !== "string" || input.password === "") {
    errors.push("password wajib diisi.");
  } else {
    data.password = input.password;
  }

  return { errors, data };
}
