import Quiz from "../models/Quiz.js";
import Team from "../models/Team.js";
import Answer from "../models/Answer.js";

const createQuiz = async (req, res) => {
  const { name } = req.body;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  try {
    const newQuiz = new Quiz({ name, code, questions: [], isActive: false });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Musobaqa yaratishda xato", error });
  }
};

const activateQuiz = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code });
    if (!quiz) return res.status(404).json({ message: "Musobaqa topilmadi" });
    if (quiz.isActive)
      return res.status(400).json({ message: "Musobaqa allaqachon aktiv" });

    quiz.isActive = true;
    await quiz.save();
    res.json({ message: "Musobaqa aktivlashtirildi", quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Musobaqani aktivlashtirishda xato", error });
  }
};

const deactivateQuiz = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code });
    if (!quiz) return res.status(404).json({ message: "Musobaqa topilmadi" });
    if (!quiz.isActive)
      return res.status(400).json({ message: "Musobaqa allaqachon deaktiv" });

    quiz.isActive = false;
    quiz.completedAt = new Date(); // Tugash vaqtini belgilash
    await quiz.save();
    res.json({ message: "Musobaqa deaktivlashtirildi", quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Musobaqani deaktivlashtirishda xato", error });
  }
};

const getQuizByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code }).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Musobaqa topilmadi" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Musobaqa olishda xato", error });
  }
};

const deleteQuiz = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOneAndDelete({ code });
    if (!quiz) return res.status(404).json({ message: "Musobaqa topilmadi" });
    res.json({ message: "Musobaqa o'chirildi", quiz });
  } catch (error) {
    res.status(500).json({ message: "Musobaqani o'chirishda xato", error });
  }
};

// Yangi: Umumiy statistika
const getQuizStats = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code });
    if (!quiz) return res.status(404).json({ message: "Musobaqa topilmadi" });

    const teamsCount = await Team.countDocuments({ quizId: quiz._id });
    const answersCount = await Answer.countDocuments({ quizId: quiz._id });
    const correctAnswersCount = await Answer.countDocuments({
      quizId: quiz._id,
      isCorrect: true,
    });
    const incorrectAnswersCount = await Answer.countDocuments({
      quizId: quiz._id,
      isCorrect: false,
    });

    const stats = {
      quizName: quiz.name,
      code: quiz.code,
      isActive: quiz.isActive,
      completedAt: quiz.completedAt,
      totalTeams: teamsCount,
      totalQuestions: quiz.questions.length,
      totalAnswers: answersCount,
      correctAnswers: correctAnswersCount,
      incorrectAnswers: incorrectAnswersCount,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Statistika olishda xato", error });
  }
};

// Yangi: Jamoalar bo‘yicha statistika
const getTeamStats = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code });
    if (!quiz) return res.status(404).json({ message: "Musobaqa topilmadi" });

    const teams = await Team.find({ quizId: quiz._id });
    const teamStats = await Promise.all(
      teams.map(async (team) => {
        const totalAnswers = await Answer.countDocuments({ teamId: team._id });
        const correctAnswers = await Answer.countDocuments({
          teamId: team._id,
          isCorrect: true,
        });
        const fastestAnswer = await Answer.findOne({ teamId: team._id }).sort({
          submittedAt: 1,
        });

        return {
          teamId: team._id,
          teamName: team.name,
          score: team.score,
          totalAnswers,
          correctAnswers,
          incorrectAnswers: totalAnswers - correctAnswers,
          fastestAnswerTime: fastestAnswer ? fastestAnswer.createdAt : null,
        };
      })
    );

    // Reyting bo‘yicha tartiblash
    teamStats.sort((a, b) => b.score - a.score);

    res.json(teamStats);
  } catch (error) {
    res.status(500).json({ message: "Jamoalar statistikasida xato", error });
  }
};

// Yangi: Savollar bo‘yicha statistika
const getQuestionStats = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code }).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Musobaqa topilmadi" });

    const questionStats = await Promise.all(
      quiz.questions.map(async (question) => {
        const totalAnswers = await Answer.countDocuments({
          questionId: question._id,
        });
        const correctAnswers = await Answer.countDocuments({
          questionId: question._id,
          isCorrect: true,
        });

        return {
          questionId: question._id,
          questionText: question.text,
          timeLimit: question.timeLimit,
          points: question.points,
          totalAnswers,
          correctAnswers,
          incorrectAnswers: totalAnswers - correctAnswers,
          correctAnswerPercentage: totalAnswers
            ? (correctAnswers / totalAnswers) * 100
            : 0,
        };
      })
    );

    res.json(questionStats);
  } catch (error) {
    res.status(500).json({ message: "Savollar statistikasida xato", error });
  }
};

export {
  createQuiz,
  activateQuiz,
  deactivateQuiz,
  deleteQuiz,
  getQuizByCode,
  getQuizStats,
  getTeamStats,
  getQuestionStats,
};
