import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);

export default app;
