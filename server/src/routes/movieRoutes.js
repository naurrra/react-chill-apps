// routes/movieRoutes.js
// Semua endpoint /movie. Setiap handler memanggil fungsi dari movieService.
// Semua endpoint dilindungi verifyToken (harus membawa token JWT yang valid).

import { Router } from "express";
import {
  selectAllMovies,
  selectMovieById,
  insertMovie,
  updateMovieById,
  deleteMovieById,
} from "../services/movieService.js";
import { parseId, validateMovie, parseMovieQuery } from "../validators/movieValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

function badRequest(res, message) {
  return res.status(400).json({ status: "error", message });
}

function notFound(res) {
  return res.status(404).json({ status: "error", message: "Movie tidak ditemukan." });
}

// GET /movie
// Query params (semua opsional):
//   genre=Anime              -> FILTER
//   search=sonic             -> SEARCH pada title
//   sortBy=rating:desc       -> SORT (kolom atau kolom:asc / kolom:desc)
router.get("/", verifyToken, async (req, res) => {
  const { errors, options } = parseMovieQuery(req.query);
  if (errors.length > 0) return badRequest(res, errors.join(" "));

  const data = await selectAllMovies(options);
  res.json({ status: "success", data });
});

// GET /movie/:id -> satu movie berdasarkan id
router.get("/:id", verifyToken, async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return badRequest(res, "id harus berupa bilangan bulat positif.");

  const movie = await selectMovieById(id);
  if (!movie) return notFound(res);

  res.json({ status: "success", data: movie });
});

// POST /movie -> tambah movie baru
router.post("/", verifyToken, async (req, res) => {
  const { errors, data } = validateMovie(req.body, { partial: false });
  if (errors.length > 0) return badRequest(res, errors.join(" "));

  const newId = await insertMovie(data);
  const created = await selectMovieById(newId);

  res.status(201).json({ status: "success", data: created });
});

// PUT /movie/:id   -> ubah semua field (title dan genre wajib)
// PATCH /movie/:id -> ubah sebagian field
function updateHandler(partial) {
  return async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) return badRequest(res, "id harus berupa bilangan bulat positif.");

    const { errors, data } = validateMovie(req.body, { partial });
    if (errors.length > 0) return badRequest(res, errors.join(" "));

    const existing = await selectMovieById(id);
    if (!existing) return notFound(res);

    await updateMovieById(id, data);
    const updated = await selectMovieById(id);

    res.json({ status: "success", data: updated });
  };
}

router.put("/:id", verifyToken, updateHandler(false));
router.patch("/:id", verifyToken, updateHandler(true));

// DELETE /movie/:id -> hapus movie
router.delete("/:id", verifyToken, async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return badRequest(res, "id harus berupa bilangan bulat positif.");

  const deleted = await deleteMovieById(id);
  if (deleted === 0) return notFound(res);

  res.json({ status: "success", message: "Movie berhasil dihapus." });
});

export default router;
