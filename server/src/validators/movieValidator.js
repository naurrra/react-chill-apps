// validators/movieValidator.js
// Memeriksa isi body sebelum disimpan ke database.
// partial = true  -> boleh mengirim sebagian field (dipakai PATCH)
// partial = false -> title dan genre wajib ada (dipakai POST dan PUT)

export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function validateMovie(body, { partial }) {
  const errors = [];
  const data = {};
  const input = body && typeof body === "object" ? body : {};

  // title
  if ("title" in input) {
    if (typeof input.title !== "string" || input.title.trim() === "") {
      errors.push("title harus berupa teks dan tidak boleh kosong.");
    } else if (input.title.trim().length > 150) {
      errors.push("title maksimal 150 karakter.");
    } else {
      data.title = input.title.trim();
    }
  } else if (!partial) {
    errors.push("title wajib diisi.");
  }

  // genre
  if ("genre" in input) {
    if (typeof input.genre !== "string" || input.genre.trim() === "") {
      errors.push("genre harus berupa teks dan tidak boleh kosong.");
    } else if (input.genre.trim().length > 50) {
      errors.push("genre maksimal 50 karakter.");
    } else {
      data.genre = input.genre.trim();
    }
  } else if (!partial) {
    errors.push("genre wajib diisi.");
  }

  // rating (opsional, 0 - 10)
  if ("rating" in input) {
    if (input.rating === null) {
      data.rating = null;
    } else if (
      typeof input.rating !== "number" ||
      !Number.isFinite(input.rating) ||
      input.rating < 0 ||
      input.rating > 10
    ) {
      errors.push("rating harus berupa angka antara 0 sampai 10.");
    } else {
      data.rating = Math.round(input.rating * 10) / 10;
    }
  } else if (!partial) {
    data.rating = null;
  }

  // release_year (opsional)
  if ("release_year" in input) {
    if (input.release_year === null) {
      data.release_year = null;
    } else if (
      !Number.isInteger(input.release_year) ||
      input.release_year < 1888 ||
      input.release_year > 2100
    ) {
      errors.push("release_year harus berupa tahun yang valid (1888 - 2100).");
    } else {
      data.release_year = input.release_year;
    }
  } else if (!partial) {
    data.release_year = null;
  }

  if (partial && errors.length === 0 && Object.keys(data).length === 0) {
    errors.push("Tidak ada field yang dikirim untuk diubah.");
  }

  return { errors, data };
}