// routes/authRoutes.js
// POST /register, POST /login, GET /verify-email

import { Router } from "express";
import { register, login, verifyEmail } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);

export default router;
