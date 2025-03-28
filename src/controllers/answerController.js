// /src/controllers/answerController.js
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";
import Team from "../models/Team.js";

const submitAnswer = async (req, res) => {
  const { quizCode, teamId, questionId, answer } = req.body;

  try {
    const quiz = await Quiz.findOne({ code: quizCode });
    if (!quiz) {
      return res.status(404).json({ message: "Musobaqa topilmadi" });
    }

    if (!quiz.isActive) {
      return res.status(403).json({ message: "Musobaqa aktiv emas" });
    }

    const existingAnswer = await Answer.findOne({ teamId, questionId });
    if (existingAnswer) {
      return res.status(400).json({
        message: "Bu jamoa ushbu savolga allaqachon javob bergan",
      });
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
      const question = await Question.findById(answer.questionId);
      if (team && question) {
        // Turnir uchun ballni yangilash
        const quizScore = team.quizScores.find(
          (qs) => qs.quizId.toString() === answer.quizId.toString()
        );

        if (quizScore) {
          // Agar turnir uchun ball allaqachon mavjud bo‘lsa, qo‘shish
          quizScore.score += question.points;
        } else {
          // Agar turnir uchun ball yo‘q bo‘lsa, yangi qo‘shish
          team.quizScores.push({
            quizId: answer.quizId,
            score: question.points,
          });
        }

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
