import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
  {
    sessionCodeHash: { type: String, required: true, unique: true, immutable: true },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      immutable: true,
    },
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CharacterProfile",
      required: true,
      immutable: true,
    },
    status: {
      type: String,
      enum: ["registered", "in_progress", "completed", "expired"],
      default: "registered",
    },
    currentStage: { type: Number, min: 0, max: 4, default: 0 },
    score: { type: Number, min: 0, default: 0 },
    answers: {
      type: [
        new mongoose.Schema(
          {
            stage: { type: Number, required: true, min: 1, max: 4 },
            choice: { type: mongoose.Schema.Types.Mixed, required: true },
            isCorrect: { type: Boolean, required: true },
            points: { type: Number, required: true, min: 0 },
            answeredAt: { type: Date, required: true },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    startedAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date, default: null },
    duration: { type: Number, min: 0, default: null },
    expiresAt: { type: Date, required: true },
    retentionExpiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

gameSessionSchema.index({ retentionExpiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.GameSession ||
  mongoose.model("GameSession", gameSessionSchema);
