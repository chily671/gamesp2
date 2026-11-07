const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

const missions = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "src", "data", "seed", "missions.json"),
    "utf8",
  ),
);

async function seedMissions() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI. Set it before seeding missions.");
  }

  if (
    missions.length !== 4 ||
    missions.some(
      (mission, index) =>
        mission.stage !== index + 1 ||
          !["single", "multiple"].includes(mission.answerMode) ||
          !Array.isArray(mission.correctAnswer) ||
        mission.options.length < 2,
    )
  ) {
    throw new Error("Mission seed data failed its integrity checks.");
  }

  await mongoose.connect(mongoUri);
  const collectionName = mongoose.pluralize()("Mission");
  const operations = missions.map((mission) => ({
    updateOne: {
      filter: { missionCode: mission.missionCode },
      update: {
        $setOnInsert: Object.fromEntries(
          Object.entries(mission).filter(
            ([key]) => !["answerMode", "story"].includes(key),
          ),
        ),
        $set: {
          answerMode: mission.answerMode,
          story: mission.story,
        },
      },
      upsert: true,
    },
  }));
  const result = await mongoose.connection
    .collection(collectionName)
    .bulkWrite(operations, { ordered: true });

  console.log(
    `Mission seed complete: ${result.upsertedCount} inserted, ${result.matchedCount} already present.`,
  );
}

seedMissions()
  .catch((error) => {
    console.error("Mission seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
