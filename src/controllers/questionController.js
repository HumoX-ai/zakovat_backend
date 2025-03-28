import Question from "../models/Question.js";
import Quiz from "../models/Quiz.js";

const addQuestion = async (req, res) => {
  const { quizCode, questionText, timeLimit, points } = req.body;

  try {
    const quiz = await Quiz.findOne({ code: quizCode });
    if (!quiz) {
      return res.status(404).json({ message: "Musobaqa topilmadi" });
    }

    const newQuestion = new Question({
      quizId: quiz._id,
      text: questionText,
      timeLimit,
      points: points || 1,
    });
    await newQuestion.save();

    quiz.questions.push(newQuestion._id);
    await quiz.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Savol qo‘shishda xato", error });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    if (!questions.length) {
      return res.status(404).json({ message: "Savollar topilmadi" });
    }
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Savollarni olishda xato", error });
  }
};

const getQuestionById = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Savol topilmadi" });
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Savolni olishda xato", error });
  }
};

export { addQuestion, getQuestions, getQuestionById };
