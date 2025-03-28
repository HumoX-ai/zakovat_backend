import mongoose from "mongoose";

const { Schema } = mongoose;

const TeamSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Parol (keyinchalik hash qilinadi)
    role: { type: String, enum: ["user", "admin"], default: "user" },
    score: { type: Number, default: 0 }, // Umumiy ball (agar kerak bo‘lsa)
    quizzes: [{ type: Schema.Types.ObjectId, ref: "Quiz" }], // Qo‘shilgan musobaqalar ro‘yxati
    quizScores: [
      {
        quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        score: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Team", TeamSchema);
