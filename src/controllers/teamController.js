import Team from "../models/Team.js";
import Quiz from "../models/Quiz.js";

const joinQuiz = async (req, res) => {
  const { quizCode, teamName } = req.body;

  try {
    const quiz = await Quiz.findOne({ code: quizCode });
    if (!quiz) {
      return res.status(404).json({ message: "Musobaqa topilmadi" });
    }

    const newTeam = new Team({ quizId: quiz._id, name: teamName, score: 0 });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: "Jamoa qo‘shishda xato", error });
  }
};

export { joinQuiz };
