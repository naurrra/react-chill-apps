// services/uploadService.js
// Konfigurasi multer untuk upload gambar. File disimpan di folder uploads/
// (di root aplikasi). Nama file dibuat acak; nama asli dari klien tidak dipakai.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// server/src/services -> server/uploads
export const UPLOAD_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads"
);
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Hanya tipe gambar ini yang diterima (SVG sengaja tidak diizinkan).
const ALLOWED_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export class UploadError extends Error {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${uuidv4()}${ALLOWED_TYPES[file.mimetype]}`),
});

// fileFilter sengaja sinkron (tanpa async) untuk menghindari celah multer
// CVE-2026-113872 pada fileFilter asinkron.
function fileFilter(req, file, cb) {
  if (!Object.hasOwn(ALLOWED_TYPES, file.mimetype)) {
    return cb(new UploadError("Tipe file tidak didukung. Gunakan JPEG, PNG, atau WebP."));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 5, fieldNameSize: 50 },
});

// Menerima satu file pada field bernama "file".
export const uploadSingleImage = upload.single("file");

// Memeriksa byte awal file, karena tipe dari klien (Content-Type) bisa dipalsukan.
export async function hasValidImageSignature(filePath) {
  const handle = await fs.promises.open(filePath, "r");
  try {
    const buf = Buffer.alloc(12);
    await handle.read(buf, 0, 12, 0);

    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
    const isPng = buf
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isWebp =
      buf.subarray(0, 4).toString("ascii") === "RIFF" &&
      buf.subarray(8, 12).toString("ascii") === "WEBP";

    return isJpeg || isPng || isWebp;
  } finally {
    await handle.close();
  }
}

export async function removeFile(filePath) {
  await fs.promises.unlink(filePath).catch(() => {});
}
