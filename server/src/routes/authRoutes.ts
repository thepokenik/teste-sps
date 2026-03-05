import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login } from "../controllers/authController";

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: "Muitas tentativas. Tente novamente mais tarde." },
});

const router = Router();

router.post("/login", loginLimiter, login);

export default router;
