import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import attachRoutes from "./routes/attachRoutes";

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET not defined in environment variables");
    process.exit(1);
}

const app = express();
const BODY_LIMIT = process.env.BODY_LIMIT || "10mb";

app.use(cors());
app.use(express.json({ limit: BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: BODY_LIMIT }));

app.get("/", (req, res) => {
    res.json({ message: "API is running!" });
});

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", attachRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err?.type === "entity.too.large") {
        res.status(413).json({
            error: `Payload muito grande. O limite atual é ${BODY_LIMIT}.`,
        });
        return;
    }
    next(err);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
