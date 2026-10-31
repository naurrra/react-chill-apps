// services/movieService.js
// Semua query SQL ada di sini. Route hanya memanggil fungsi-fungsi ini.
// Seluruh nilai dari pengguna dikirim lewat placeholder (?) sehingga tidak
// pernah digabung langsung ke teks SQL (mencegah SQL injection).

import pool from "../config/db.js";

const COLUMNS = "id, title, genre, rating, release_year";

// Kolom yang boleh diubah. Nama kolom pada UPDATE hanya diambil dari daftar ini.
const UPDATABLE_COLUMNS = ["title", "genre", "rating", "release_year"];

// Kolom yang boleh dipakai ORDER BY. ORDER BY tidak bisa memakai placeholder,
// jadi nama kolom dan arah urutan hanya diambil dari daftar tetap ini.
const SORT_COLUMNS = {
  id: "id",
  title: "title",
  genre: "genre",
  rating: "rating",
  release_year: "release_year",
};
const SORT_DIRECTIONS = { asc: "ASC", desc: "DESC" };

// Karakter khusus LIKE (% dan _) dari pengguna dianggap teks biasa.
function escapeLike(value) {
  return value.replace(/[\\%_]/g, "\\$&");
}

// ---------- SELECT ----------

// Menyusun query daftar movie: FILTER (genre), SEARCH (title), SORT (ORDER BY).
// Dibuat sebagai fungsi terpisah supaya mudah diuji tanpa database.
export function buildMovieListQuery({ genre, search, sortBy } = {}) {
  const conditions = [];
  const params = [];

  if (genre) {
    conditions.push("genre = ?");
    params.push(genre);
  }
  if (search) {
    conditions.push("title LIKE ?");
    params.push(`%${escapeLike(search)}%`);
  }

  const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

  const column =
    sortBy && Object.hasOwn(SORT_COLUMNS, sortBy.field) ? SORT_COLUMNS[sortBy.field] : "id";
  const direction =
    sortBy && Object.hasOwn(SORT_DIRECTIONS, sortBy.direction)
      ? SORT_DIRECTIONS[sortBy.direction]
      : "ASC";

  // Urutan kedua (id) menjaga hasil tetap stabil saat nilai kolom sama.
  const orderBy = column === "id" ? `id ${direction}` : `${column} ${direction}, id ASC`;

  return {
    sql: `SELECT ${COLUMNS} FROM movies${where} ORDER BY ${orderBy}`,
    params,
  };
}

// SELECT * : ambil semua data (opsional dengan filter, search, dan sort)
export async function selectAllMovies(options = {}) {
  const { sql, params } = buildMovieListQuery(options);
  const [rows] = await pool.execute(sql, params);
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
