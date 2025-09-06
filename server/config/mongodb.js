import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`); 
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Optional: debugging connection events
mongoose.connection.on("connected", () => console.log("📡 Mongoose connected"));
mongoose.connection.on("error", (err) => console.error("⚠️ Mongoose error:", err));
mongoose.connection.on("disconnected", () => console.log("🔌 Mongoose disconnected"));

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔒 MongoDB connection closed");
  process.exit(0);
});

export default connectDB;
