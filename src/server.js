import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import quizRoutes from "./routes/quizRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };

// Environment o'zgaruvchilarini yuklab olish
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ES modulda __dirname hosil qilish
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware sozlamalari
app.use(
  cors({
    origin: "*", // Ishlab chiqish uchun. Ishlab chiqishda aniq domenni ko'rsating
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(json());

// Swagger UI statik fayllarini serverlash
app.use(
  "/swagger-ui",
  express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
);

// Swagger UI sozlamalari
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css", // Logotipni yashirish
    customSiteTitle: "API Hujjatlari",
    swaggerOptions: {
      docExpansion: "none", // Barcha bo'limlarni yopiq holda ochish
      filter: true, // Qidiruvni yoqish
    },
  })
);

// Marshrutlar
app.use("/api/quiz", quizRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes);

// MongoDB ulanishi va serverni ishga tushirish
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server ${PORT}-portda ishga tushdi`);
      console.log(`Swagger UI manzili: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Serverda xatolik yuz berdi:", error);
  }
};

startServer();
