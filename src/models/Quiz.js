import mongoose from "mongoose";

const { Schema } = mongoose;

const QuizSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", QuizSchema);
