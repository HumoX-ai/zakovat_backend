import mongoose from "mongoose";

const { Schema } = mongoose;

const TeamSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    name: { type: String, required: true },
    score: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Team", TeamSchema);
