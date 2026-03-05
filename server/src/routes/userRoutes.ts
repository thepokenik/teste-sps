import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { listUsers, createUser, updateUser, deleteUser } from "../controllers/userController";

const router = Router();

router.get("/users", verifyToken, listUsers);
router.post("/users", verifyToken, createUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

export default router;
