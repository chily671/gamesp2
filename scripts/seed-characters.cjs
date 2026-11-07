const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const profilesPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "seed",
  "character-profiles.json",
);
const profiles = JSON.parse(fs.readFileSync(profilesPath, "utf8"));

async function seedCharacters() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI. Set it before seeding profiles.");
  }

  const codes = profiles.map((profile) => profile.characterCode);
  if (
    profiles.length !== 5 ||
    new Set(codes).size !== profiles.length ||
    profiles.some((profile) => profile.isDemoOnly !== true)
  ) {
    throw new Error("Character seed data failed its integrity checks.");
  }

  await mongoose.connect(mongoUri);
  const collectionName = mongoose.pluralize()("CharacterProfile");
  const operations = profiles.map((profile) => ({
    updateOne: {
      filter: { characterCode: profile.characterCode },
      update: { $setOnInsert: profile },
      upsert: true,
    },
  }));
  const result = await mongoose.connection
    .collection(collectionName)
    .bulkWrite(operations, { ordered: true });

  console.log(
    `Character seed complete: ${result.upsertedCount} inserted, ${result.matchedCount} already present.`,
  );
}

seedCharacters()
  .catch((error) => {
    console.error("Character seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
