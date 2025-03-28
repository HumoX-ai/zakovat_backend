import express from "express";
import {
  createTeam,
  loginTeam,
  joinQuiz,
  getAllTeams,
  authenticateTeam,
  getQuizScore,
  getTeamQuizAnswers,
  authenticateAdmin,
  getAdminDashboard,
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/create", createTeam);
router.post("/login", loginTeam);
router.post("/join", authenticateTeam, joinQuiz);
router.get("/", getAllTeams);
router.get("/:teamId/quiz/:quizId/score", authenticateTeam, getQuizScore);
router.get(
  "/:teamId/quiz/:quizId/answers",
  authenticateTeam,
  getTeamQuizAnswers
);
router.get("/admin/dashboard", authenticateAdmin, getAdminDashboard);

export default router;
