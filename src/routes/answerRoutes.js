import express from "express";
import {
  moderateAnswer,
  submitAnswer,
} from "../controllers/answerController.js";

const router = express.Router();

router.post("/", submitAnswer);
router.patch("/:answerId", moderateAnswer);

export default router;
