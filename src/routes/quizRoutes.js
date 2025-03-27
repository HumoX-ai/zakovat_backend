import { Router } from "express";
import {
  activateQuiz,
  createQuiz,
  deactivateQuiz,
  getQuizByCode,
} from "../controllers/quizController.js";

const router = Router();

router.post("/", createQuiz);
router.get("/:code", getQuizByCode);
router.post("/:code/activate", activateQuiz);
router.post("/:code/deactivate", deactivateQuiz);

export default router;
