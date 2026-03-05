require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "API is running!" });
});

app.use("/", authRoutes);
app.use("/", userRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
