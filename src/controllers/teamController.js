import Team from "../models/Team.js";
import Quiz from "../models/Quiz.js";
import Answer from "../models/Answer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Jamoa yaratish (ro‘yxatdan o‘tish)
const createTeam = async (req, res) => {
  const { teamName, username, password } = req.body;

  try {
    const existingTeam = await Team.findOne({ username });
    if (existingTeam) {
      return res
        .status(400)
        .json({ message: "Bu nomdagi jamoa allaqachon mavjud" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Parolni hash qilish
    const newTeam = new Team({
      name: teamName,
      username,
      password: hashedPassword,
      role: "user",
      quizzes: [],
    });
    await newTeam.save();
    res.status(201).json({
      message: "Jamoa muvaffaqiyatli yaratildi",
      team: { id: newTeam._id, name: newTeam.name },
    });
  } catch (error) {
    res.status(500).json({ message: "Jamoa yaratishda xato", error });
  }
};

const loginTeam = async (req, res) => {
  const { username, password } = req.body;

  try {
    const team = await Team.findOne({ username });
    if (!team) {
      return res.status(404).json({ message: "Jamoa topilmadi" });
    }

    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Parol noto‘g‘ri" });
    }

    const token = jwt.sign(
      { teamId: team._id, username: team.username },
      process.env.JWT_SECRET || "my-secret-key",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Kirish muvaffaqiyatli",
      team: {
        id: team._id,
        name: team.name,
        username: team.username,
        quizzes: team.quizzes,
      },
      token,
    });
  } catch (error) {
    console.error("Login xatosi:", error);
    res.status(500).json({ message: "Kirishda xato", error: error.message });
  }
};

// Tokenni tekshirish middleware
const authenticateTeam = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token topilmadi" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "my-secret-key"
    );
    req.team = decoded; // Dekodlangan ma'lumotni requestga qo‘shamiz
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Noto‘g‘ri yoki muddati o‘tgan token" });
  }
};

const authenticateAdmin = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const ADMIN_KEY = "PDP25"; // Statik kalit

  if (apiKey !== ADMIN_KEY) {
    return res.status(403).json({ message: "Admin uchun ruxsat yo‘q" });
  }

  next();
};

const getAdminDashboard = async (req, res) => {
  try {
    const teams = await Team.find().select("-password");
    const quizzes = await Quiz.find();

    res.status(200).json({
      message: "Admin dashboard",
      totalTeams: teams.length,
      totalQuizzes: quizzes.length,
      teams,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard olishda xato", error });
  }
};

// Musobaqaga qo‘shilish
const joinQuiz = async (req, res) => {
  const { teamId, quizCode } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Jamoa topilmadi" });
    }

    const quiz = await Quiz.findOne({ code: quizCode });
    if (!quiz) {
      return res.status(404).json({ message: "Musobaqa topilmadi" });
    }

    if (team.quizzes.includes(quiz._id)) {
      return res
        .status(400)
        .json({ message: "Jamoa bu musobaqaga allaqachon qo‘shilgan" });
    }

    team.quizzes.push(quiz._id);
    await team.save();
    res.status(200).json({ message: "Jamoa musobaqaga qo‘shildi", team });
  } catch (error) {
    res.status(500).json({ message: "Musobaqaga qo‘shilishda xato", error });
  }
};

// Barcha jamoalarni olish
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().select("-password").populate("quizzes");
    if (!teams.length) {
      return res.status(404).json({ message: "Jamoalar topilmadi" });
    }
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Jamoalar olishda xato", error });
  }
};
const getQuizScore = async (req, res) => {
  const { teamId, quizId } = req.params;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Jamoa topilmadi" });
    }

    const quizScore = team.quizScores.find(
      (qs) => qs.quizId.toString() === quizId
    );
    if (!quizScore) {
      return res.status(404).json({
        message: "Bu jamoa ushbu turnirda hali ball to‘plamagan",
      });
    }

    res.status(200).json({
      message: "Turnir ballari",
      teamId,
      quizId,
      score: quizScore.score,
    });
  } catch (error) {
    res.status(500).json({ message: "Ballarni olishda xato", error });
  }
};

const getTeamQuizAnswers = async (req, res) => {
  const { teamId, quizId } = req.params;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Jamoa topilmadi" });
    }

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Turnir topilmadi" });
    }

    // Jamoaning ushbu turnirdagi barcha javoblarini olish
    const answers = await Answer.find({ teamId, quizId }).populate(
      "questionId"
    );
    console.log(answers);

    if (!answers.length) {
      return res.status(404).json({
        message: "Bu jamoa ushbu turnirda hali javob bermagan",
      });
    }

    // Javoblar ro‘yxatini formatlash
    const formattedAnswers = answers.map((answer) => ({
      questionId: answer.questionId._id,
      questionText: answer.questionId.text,
      answer: answer.answer,
      isCorrect: answer.isCorrect,
      points: answer.isCorrect ? answer.questionId.points : 0,
    }));

    // Turnir uchun umumiy ball (quizScores’dan)
    const quizScore = team.quizScores.find(
      (qs) => qs.quizId.toString() === quizId
    );

    res.status(200).json({
      message: "Jamoaning turnirdagi javoblari",
      teamId,
      quizId,
      quizName: quiz?.name,
      totalScore: quizScore ? quizScore.score : 0,
      answers: formattedAnswers,
    });
  } catch (error) {
    res.status(500).json({ message: "Javoblarni olishda xato", error });
  }
};

export {
  createTeam,
  loginTeam,
  joinQuiz,
  getAllTeams,
  authenticateTeam,
  getQuizScore,
  getTeamQuizAnswers,
  authenticateAdmin,
  getAdminDashboard,
};
