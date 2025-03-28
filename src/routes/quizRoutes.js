import { Router } from "express";
import {
  activateQuiz,
  createQuiz,
  deactivateQuiz,
  deleteQuiz,
  getQuestionStats,
  getQuizByCode,
  getQuizStats,
  getTeamStats,
} from "../controllers/quizController.js";

const router = Router();

router.post("/", createQuiz);
router.get("/:code", getQuizByCode);
router.post("/:code/activate", activateQuiz);
router.post("/:code/deactivate", deactivateQuiz);
router.delete("/:code", deleteQuiz);
router.get("/:code/stats", getQuizStats);
router.get("/:code/team-stats", getTeamStats);
router.get("/:code/question-stats", getQuestionStats);

export default router;
