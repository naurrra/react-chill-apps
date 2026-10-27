// config/db.js
// Satu connection pool untuk seluruh aplikasi.
// Nilai koneksi dibaca dari file .env 

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  // Kolom DECIMAL (rating) dikembalikan sebagai angka, bukan string.
  decimalNumbers: true,
});

export default pool;