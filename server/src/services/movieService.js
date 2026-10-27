// services/movieService.js
// Semua query SQL ada di sini. Route hanya memanggil fungsi-fungsi ini.
// Seluruh nilai dari pengguna dikirim lewat placeholder

import pool from "../config/db.js";

const COLUMNS = "id, title, genre, rating, release_year";

// Kolom yang boleh diubah. Nama kolom pada UPDATE hanya diambil dari daftar ini.
const UPDATABLE_COLUMNS = ["title", "genre", "rating", "release_year"];

// ---------- SELECT ----------

// SELECT * : ambil semua data
export async function selectAllMovies() {
  const [rows] = await pool.execute(
    `SELECT ${COLUMNS} FROM movies ORDER BY id`
  );
  return rows;
}

// SELECT by id : ambil satu data berdasarkan id
export async function selectMovieById(id) {
  const [rows] = await pool.execute(
    `SELECT ${COLUMNS} FROM movies WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

// SELECT by atribut lain : ambil data berdasarkan genre
export async function selectMoviesByGenre(genre) {
  const [rows] = await pool.execute(
    `SELECT ${COLUMNS} FROM movies WHERE genre = ? ORDER BY id`,
    [genre]
  );
  return rows;
}

// ---------- INSERT ----------

// Mengembalikan id data yang baru dibuat
export async function insertMovie({ title, genre, rating, release_year }) {
  const [result] = await pool.execute(
    "INSERT INTO movies (title, genre, rating, release_year) VALUES (?, ?, ?, ?)",
    [title, genre, rating ?? null, release_year ?? null]
  );
  return result.insertId;
}

// ---------- UPDATE ----------

// Mengubah kolom yang dikirim saja (kolom lain tidak disentuh).
// Mengembalikan jumlah kolom yang diubah.
export async function updateMovieById(id, fields) {
  const columns = UPDATABLE_COLUMNS.filter((col) => col in fields);
  if (columns.length === 0) return 0;

  const setClause = columns.map((col) => `${col} = ?`).join(", ");
  const values = columns.map((col) => fields[col] ?? null);

  await pool.execute(`UPDATE movies SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
  return columns.length;
}

// ---------- DELETE ----------

export async function deleteMovieById(id) {
  const [result] = await pool.execute("DELETE FROM movies WHERE id = ?", [id]);
  return result.affectedRows;
}