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
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
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
