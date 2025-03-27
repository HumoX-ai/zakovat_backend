import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const AnswerSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answer: { type: String, required: true },
    isCorrect: { type: Boolean, default: null },
  },
  { timestamps: true }
);

export default model("Answer", AnswerSchema);
