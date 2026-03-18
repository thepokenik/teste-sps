import { Request, Response } from "express";
import attachs from "../database/dbAttachs";

const listAttachs = (req: Request, res: Response): void => {
    const { user_id } = req.query;
    if (user_id) {
        res.json(attachs.filter((a) => a.user_id === Number(user_id)));
    } else {
        res.json(attachs);
    }
};

const createAttachs = (req: Request, res: Response): void => {
    const { user_id } = req.body;
    if (!user_id) {
        res.status(400).json({ error: "user_id é obrigatório" });
        return;
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
        res.status(400).json({ error: "Nenhum arquivo enviado" });
        return;
    }

    const newFiles = files.map((file) => ({
        name: file.originalname,
        url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
    }));

    const newId = attachs.length > 0 ? Math.max(...attachs.map((a) => a.id)) + 1 : 1;

    const newAttach = {
        id: newId,
        user_id: Number(user_id),
        files: newFiles,
    };
    attachs.push(newAttach);

    res.status(201).json(newAttach);
};

const deleteAttach = (req: Request, res: Response): void => {
    const { id } = req.params;

    const index = attachs.findIndex((a) => a.id === Number(id));
    if (index === -1) {
        res.status(404).json({ error: "Anexo não encontrado" });
        return;
    }

    attachs.splice(index, 1);
    res.status(204).send();
};

export { listAttachs, createAttachs, deleteAttach };
