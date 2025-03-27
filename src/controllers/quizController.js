import Quiz from "../models/Quiz.js";

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

const getQuizByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code }).populate("questions");

    if (!quiz) {
      return res.status(404).json({ message: "Musobaqa topilmadi" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Musobaqa olishda xato", error });
  }
};

// Musobaqani aktivlashtirish
const activateQuiz = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code });
    if (!quiz) {
      return res.status(404).json({ message: "Musobaqa topilmadi" });
    }

    if (quiz.isActive) {
      return res.status(400).json({ message: "Musobaqa allaqachon aktiv" });
    }

    quiz.isActive = true;
    await quiz.save();
    res.json({ message: "Musobaqa aktivlashtirildi", quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Musobaqani aktivlashtirishda xato", error });
  }
};

// Musobaqani deaktivlashtirish
const deactivateQuiz = async (req, res) => {
  const { code } = req.params;

  try {
    const quiz = await Quiz.findOne({ code });
    if (!quiz) {
      return res.status(404).json({ message: "Musobaqa topilmadi" });
    }

    if (!quiz.isActive) {
      return res.status(400).json({ message: "Musobaqa allaqachon deaktiv" });
    }

    quiz.isActive = false;
    await quiz.save();
    res.json({ message: "Musobaqa deaktivlashtirildi", quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Musobaqani deaktivlashtirishda xato", error });
  }
};

export { createQuiz, getQuizByCode, activateQuiz, deactivateQuiz };
