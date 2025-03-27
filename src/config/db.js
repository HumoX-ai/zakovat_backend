import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/zakovat";
    await mongoose.connect(mongoURI);
    console.log("MongoDB ga ulanish muvaffaqiyatli");
  } catch (error) {
    console.error("MongoDB ga ulanishda xato:", error);
    process.exit(1);
  }
};

export { connectDB };
