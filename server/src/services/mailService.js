// services/mailService.js
// Mengirim email dengan nodemailer. Semua pengaturan SMTP dibaca dari .env.

import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendVerificationEmail({ to, fullname, token }) {
  if (!process.env.SMTP_HOST || !process.env.MAIL_FROM) {
    throw new Error("SMTP_HOST dan MAIL_FROM belum diisi di file .env.");
  }

  const baseUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/+$/, "");
  const link = `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Verifikasi email akun Chill",
    text:
      `Halo ${fullname},\n\n` +
      `Klik tautan berikut untuk memverifikasi email Anda:\n${link}\n\n` +
      "Jika Anda tidak merasa mendaftar, abaikan email ini.",
    html:
      `<p>Halo ${escapeHtml(fullname)},</p>` +
      "<p>Klik tautan berikut untuk memverifikasi email Anda:</p>" +
      `<p><a href="${link}">${link}</a></p>` +
      "<p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>",
  });
}
