import mongoose from "mongoose";

const gameSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "default" },
    questionCount: { type: Number, required: true, min: 1, max: 1000 },
  },
  { timestamps: true },
);

export default mongoose.models.GameSettings ||
  mongoose.model("GameSettings", gameSettingsSchema);
