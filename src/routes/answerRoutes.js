import express from "express";
import {
  moderateAnswer,
  submitAnswer,
} from "../controllers/answerController.js";
import { authenticateTeam } from "../controllers/teamController.js";

const router = express.Router();

router.post("/", authenticateTeam, submitAnswer);
router.patch("/:answerId", moderateAnswer);

export default router;
