import mongoose from "mongoose";

const storylineArtifactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    evidenceId: { type: String, required: true },
    condition: {
      type: String,
      enum: ["always", "limited-permission", "broad-permission"],
      required: true,
    },
  },
  { _id: false },
);

const storylineSchema = new mongoose.Schema(
  {
    opening: { type: String, required: true },
    stage01: {
      serviceName: { type: String, required: true },
      scene: { type: String, required: true },
      limitedAction: { type: String, required: true },
      broadAction: { type: String, required: true },
    },
    stage02: {
      artifacts: {
        type: [storylineArtifactSchema],
        required: true,
        validate: (artifacts) => artifacts.length >= 3,
      },
    },
    stage03: {
      incident: { type: String, required: true },
      safeEnding: { type: String, required: true },
      exposedEnding: { type: String, required: true },
    },
    guardian: {
      opening: { type: String, required: true },
      stage01: { type: String, required: true },
      stage02: { type: String, required: true },
      stage03: { type: String, required: true },
    },
  },
  { _id: false },
);

const characterProfileSchema = new mongoose.Schema(
  {
    characterCode: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    characterName: { type: String, required: true, trim: true },
    persona: { type: String, required: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: { type: String, required: true },
    className: { type: String, required: true },
    school: { type: String, required: true },
    address: { type: String, required: true },
    housing: { type: String, required: true },
    familyMembers: { type: [String], default: [] },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      demoOnly: { type: Boolean, default: true },
    },
    socialAccounts: {
      facebookUsername: { type: String, required: true },
      simulatedPassword: { type: String, required: true },
      demoOnly: { type: Boolean, default: true },
    },
    financialInfo: {
      simulatedBalance: { type: Number, required: true, min: 0 },
      currencyLabel: { type: String, required: true },
      demoOnly: { type: Boolean, default: true },
    },
    relationshipStatus: { type: String, required: true },
    lifestyle: {
      hobbies: { type: [String], default: [] },
      habits: { type: [String], default: [] },
      frequentPlaces: { type: [String], default: [] },
      summary: { type: String, required: true },
    },
    riskFactors: { type: [String], default: [] },
    digitalFootprint: { type: [String], default: [] },
    storyline: { type: storylineSchema, default: undefined },
    isActive: { type: Boolean, default: true },
    isDemoOnly: { type: Boolean, default: true, immutable: true },
  },
  { timestamps: true },
);

export default mongoose.models.CharacterProfile ||
  mongoose.model("CharacterProfile", characterProfileSchema);
