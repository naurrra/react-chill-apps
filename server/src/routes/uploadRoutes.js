// routes/uploadRoutes.js
// POST /upload : unggah satu gambar pada field bernama "file".

import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  uploadSingleImage,
  UploadError,
  hasValidImageSignature,
  removeFile,
} from "../services/uploadService.js";

const router = Router();

router.post("/", verifyToken, (req, res, next) => {
  uploadSingleImage(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ status: "error", message: "Ukuran file melebihi 2 MB." });
      }
      return res.status(400).json({ status: "error", message: `Upload gagal: ${err.message}.` });
    }
    if (err instanceof UploadError) {
      return res.status(415).json({ status: "error", message: err.message });
    }
    if (err) return next(err);

    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "File wajib dikirim pada field bernama file." });
    }

    try {
      if (!(await hasValidImageSignature(req.file.path))) {
        await removeFile(req.file.path);
        return res.status(415).json({
          status: "error",
          message: "Isi file bukan gambar JPEG, PNG, atau WebP yang valid.",
        });
      }
    } catch (checkError) {
      await removeFile(req.file.path);
      return next(checkError);
    }

    res.status(201).json({
      status: "success",
      message: "File berhasil diunggah.",
      data: {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  });
});

export default router;
