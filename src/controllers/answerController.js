import Answer from "../models/Answer.js";
import Quiz from "../models/Quiz.js";
import Team from "../models/Team.js";

const submitAnswer = async (req, res) => {
  const { quizCode, teamId, questionId, answer } = req.body;

  try {
    const quiz = await Quiz.findOne({ code: quizCode });
    if (!quiz) {
      return res.status(404).json({ message: "Musobaqa topilmadi" });
    }

    // Musobaqa aktivligini tekshirish
    if (!quiz.isActive) {
      return res.status(403).json({ message: "Musobaqa aktiv emas" });
    }

    const newAnswer = new Answer({
      quizId: quiz._id,
      teamId,
      questionId,
      answer,
    });
    await newAnswer.save();

    res.status(201).json({ message: "Javob qabul qilindi", answer: newAnswer });
  } catch (error) {
    res.status(500).json({ message: "Javob yuborishda xato", error });
  }
};

// Yangi funksiya: Javobni moderatsiya qilish
const moderateAnswer = async (req, res) => {
  const { answerId } = req.params;
  const { isCorrect } = req.body;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Javob topilmadi" });
    }

    answer.isCorrect = isCorrect;
    await answer.save();

    if (isCorrect) {
      const team = await Team.findById(answer.teamId);
      if (team) {
        team.score += 1;
        await team.save();
      }
    }

    res.json({
      message: "Javob moderatsiya qilindi",
      answer,
      team: await Team.findById(answer.teamId),
    });
  } catch (error) {
    res.status(500).json({ message: "Javob moderatsiyasida xato", error });
  }
};

export { submitAnswer, moderateAnswer };
