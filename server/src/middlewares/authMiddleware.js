// middlewares/authMiddleware.js
// Memeriksa token JWT pada header: Authorization: Bearer <token>

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

function unauthorized(res, message) {
  res.set("WWW-Authenticate", "Bearer");
  return res.status(401).json({ status: "error", message });
}

export function verifyToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return unauthorized(res, "Autentikasi gagal: token tidak ditemukan.");
  }

  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  if (!match) {
    return unauthorized(res, "Autentikasi gagal: gunakan format 'Authorization: Bearer <token>'.");
  }

  try {
    // Algoritma dipatok HS256 supaya token dengan algoritma lain ditolak.
    req.user = jwt.verify(match[1], JWT_SECRET, { algorithms: ["HS256"] });
    next();
  } catch {
    return unauthorized(res, "Autentikasi gagal: token tidak valid atau sudah kedaluwarsa.");
  }
}
