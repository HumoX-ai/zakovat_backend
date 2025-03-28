import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import quizRoutes from "./routes/quizRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };
import path from "path"; // Bu import qo‘shiladi
import { fileURLToPath } from "url"; // ES modullar uchun qo‘shiladi

dotenv.config();

// ES modullar uchun __dirname ekvivalentini olish
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(json());

// Swagger UI statik fayllarini xizmat qilish
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Marshrutlar
app.use("/api/quiz", quizRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes);

// MongoDB ga ulanish va serverni ishga tushirish
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} da ishlamoqda`);
    console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  });
};

startServer();