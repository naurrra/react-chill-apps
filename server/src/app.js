// app.js
// Menyusun aplikasi Express: middleware, route, dan penanganan error.

import express from "express";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.disable("x-powered-by");

// inflate: false -> body request terkompresi (gzip, br, dll.) ditolak dengan 415.
// Mengurangi keterpaparan terhadap celah dekoder Brotli (CVE-2026-111497).
app.use(express.json({ limit: "100kb", inflate: false }));

app.use(authRoutes); // /register, /login, /verify-email
app.use("/movie", movieRoutes);
app.use("/upload", uploadRoutes);

// Route yang tidak dikenal
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Endpoint tidak ditemukan." });
});

// Penanganan error terpusat (Express 5 meneruskan error async ke sini).
// Detail error hanya ditulis ke log server, tidak dikirim ke klien.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ status: "error", message: "Body bukan JSON yang valid." });
  }

  console.error(err);
  res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
});

export default app;
