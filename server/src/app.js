// app.js
// Menyusun aplikasi Express: middleware, route, dan penanganan error.

import express from "express";
import movieRoutes from "./routes/movieRoutes.js";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb", inflate: false }));

app.use("/movie", movieRoutes);

// Route yang tidak dikenal
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Endpoint tidak ditemukan." });
});

// Penanganan error terpusat (Express 5 meneruskan error async ke sini).
// Detail error hanya ditulis ke log server, tidak dikirim ke klien.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ status: "error", message: "Invalid JSON in request body." });
  }

  console.error(err);
  res.status(500).json({ status: "error", message: "Terjadi kesalahan pada server." });
});

export default app;