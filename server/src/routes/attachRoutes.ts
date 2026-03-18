import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import isAdmin from "../middlewares/isAdmin";
import { listAttachs, createAttachs, deleteAttach } from "../controllers/attachController";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/attachs", verifyToken, listAttachs);
router.post("/attachs", verifyToken, isAdmin, upload.array("attachments"), createAttachs);
router.delete("/attachs/:id", verifyToken, isAdmin, deleteAttach);

export default router;
