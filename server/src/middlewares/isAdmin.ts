import { Request, Response, NextFunction } from "express";

const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.type !== "admin") {
        res.status(403).json({ error: "Acesso negado" });
        return;
    }
    next();
};

export default isAdmin;
