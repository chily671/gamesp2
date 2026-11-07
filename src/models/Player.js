import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    playerCode: { type: String, required: true, unique: true, immutable: true },
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    className: { type: String, required: true, trim: true, maxlength: 20 },
    noticePresentedAt: { type: Date, required: true },
    noticeVersion: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

playerSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Player || mongoose.model("Player", playerSchema);
