import mongoose from "mongoose";
const { Schema } = mongoose;

const QuestionSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    text: { type: String, required: true },
    timeLimit: { type: Number, required: true },
    points: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
