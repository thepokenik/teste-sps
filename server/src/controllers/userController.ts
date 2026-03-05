import { Request, Response } from "express";
import users from "../database/db";

const listUsers = (req: Request, res: Response): void => {
    const usersWithoutPassword = users.map(({ password: _, ...user }) => user);
    res.json(usersWithoutPassword);
};

const createUser = (req: Request, res: Response): void => {
    const { name, email, type, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
        return;
    }

    const exists = users.find((u) => u.email === email);
    if (exists) {
        res.status(400).json({ error: "Email já registrado por outro usuário" });
        return;
    }

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser = { id: newId, name, email, type: type || "user", password };
    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
};

const updateUser = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { name, email, type, password } = req.body;

    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
    }

    if (email && email !== users[index].email) {
        const emailExists = users.find(
            (u) => u.email === email && u.id !== Number(id)
        );
        if (emailExists) {
            res.status(400).json({ error: "Email já registrado por outro usuário" });
            return;
        }
    }

    if (name) users[index].name = name;
    if (email) users[index].email = email;
    if (type) users[index].type = type;
    if (password) users[index].password = password;

    const { password: _, ...userWithoutPassword } = users[index];
    res.json(userWithoutPassword);
};

const deleteUser = (req: Request, res: Response): void => {
    const { id } = req.params;

    const index = users.findIndex((u) => u.id === Number(id));
    if (index === -1) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
    }

    users.splice(index, 1);
    res.status(204).send();
};

export { listUsers, createUser, updateUser, deleteUser };
