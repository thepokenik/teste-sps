import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import { listUsers, createUser, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

router.get("/users", verifyToken, listUsers);
router.post("/users", verifyToken, isAdmin, createUser);
router.put("/users/:id", verifyToken, isAdmin, updateUser);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

export default router;
