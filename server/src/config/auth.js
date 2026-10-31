// config/auth.js
// Pengaturan JWT. Aplikasi menolak berjalan jika JWT_SECRET tidak aman.

const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error(
    "JWT_SECRET wajib diisi di file .env dengan teks acak minimal 32 karakter."
  );
}

export const JWT_SECRET = secret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
