import express from "express";
import cors from "cors";
import "dotenv/config";
import productRoutes from "./routes/product.routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
