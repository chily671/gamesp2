import mongoose from "mongoose";

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
    isActive: { type: Boolean, default: true },
    isDemoOnly: { type: Boolean, default: true, immutable: true },
  },
  { timestamps: true },
);

export default mongoose.models.CharacterProfile ||
  mongoose.model("CharacterProfile", characterProfileSchema);
