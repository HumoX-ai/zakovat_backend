import express from "express";
import { joinQuiz } from "../controllers/teamController.js";

const router = express.Router();

router.post("/", joinQuiz);

export default router;
