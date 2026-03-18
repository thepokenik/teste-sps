import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import { listUsers, createUser, updateUser, deleteUser } from "../controllers/userController";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/users", verifyToken, listUsers);
router.post("/users", verifyToken, isAdmin, upload.single("imageUrl"), createUser);
router.put("/users/:id", verifyToken, isAdmin, upload.single("imageUrl"), updateUser);
router.delete("/users/:id", verifyToken, isAdmin, deleteUser);

export default router;
