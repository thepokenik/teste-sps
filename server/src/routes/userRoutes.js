const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
	listUsers,
	createUser,
	updateUser,
	deleteUser,
} = require("../controllers/userController");

router.get("/users", verifyToken, listUsers);
router.post("/users", verifyToken, createUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

module.exports = router;
