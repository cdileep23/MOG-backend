import mongoose from "mongoose";

const Url: string = process.env.DATABASE_URL || "";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(Url);
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
