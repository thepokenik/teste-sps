import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import users from "../database/db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 10;

interface FailureRecord {
    count: number;
    firstAttempt: number;
}

const failureMap = new Map<string, FailureRecord>();

const login = (req: Request, res: Response): void => {
    const { email, password } = req.body;

    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const record = failureMap.get(ip);

    if (record) {
        if (now - record.firstAttempt < WINDOW_MS) {
            if (record.count >= MAX_FAILURES) {
                res.status(429).json({ error: "Muitas tentativas. Tente novamente mais tarde." });
                return;
            }
        } else {
            failureMap.delete(ip);
        }
    }

    const user = users.find((u) => u.email === email);

    if (!user || user.password !== password) {
        const existing = failureMap.get(ip);
        if (existing && now - existing.firstAttempt < WINDOW_MS) {
            existing.count++;
        } else {
            failureMap.set(ip, { count: 1, firstAttempt: now });
        }
        res.status(401).json({ error: "Email ou senha inválidos." });
        return;
    }

    failureMap.delete(ip);

    const token = jwt.sign(
        { id: user.id, type: user.type },
        process.env.JWT_SECRET as string,
        { expiresIn: "2h" }
    );

    res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            imageUrl: user.imageUrl,
        },
        token,
    });
};

export { login };
