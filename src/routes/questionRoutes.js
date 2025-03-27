import express from "express";
import {
  addQuestion,
  getQuestions,
  getQuestionById,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/", addQuestion);
router.get("/", getQuestions);
router.get("/:questionId", getQuestionById);

export default router;
