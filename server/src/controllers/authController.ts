import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import users from "../database/db";

const login = (req: Request, res: Response): void => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user || user.password !== password) {
        res.status(401).json({ error: "Email ou senha inválidos." });
        return;
    }

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
        },
        token,
    });
};

export { login };
