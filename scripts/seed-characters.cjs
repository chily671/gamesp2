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
const storylines = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "src", "data", "seed", "character-storylines.json"),
    "utf8",
  ),
);
const profilesWithStorylines = profiles.map((profile) => ({
  ...profile,
  storyline: storylines[profile.characterCode],
}));

const migrationId = "character-profiles-rpg-v1";

async function seedCharacters() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI. Set it before seeding profiles.");
  }

  const codes = profilesWithStorylines.map((profile) => profile.characterCode);
  if (
    profilesWithStorylines.length !== 20 ||
    new Set(codes).size !== profiles.length ||
    profilesWithStorylines.some(
      (profile) =>
        profile.isDemoOnly !== true ||
        profile.contact?.demoOnly !== true ||
        !profile.contact?.email.endsWith(".invalid") ||
        !/[x]/i.test(profile.contact.phone) ||
        !profile.storyline,
    )
  ) {
    throw new Error("Character seed data failed its integrity checks.");
  }

  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;
  const profilesCollection = db.collection(
    mongoose.pluralize()("CharacterProfile"),
  );
  const sessionsCollection = db.collection(mongoose.pluralize()("GameSession"));
  const migrationsCollection = db.collection("datamigrations");
  const migration = await migrationsCollection.findOne({ _id: migrationId });

  if (migration?.status === "completed") {
    console.log("Character profile migration already completed; no changes made.");
    return;
  }

  let oldProfiles = migration?.oldProfiles;
  let startedAt = migration?.startedAt;

  if (!migration) {
    const existingProfiles = await profilesCollection.find({}).toArray();
    const legacyCodes = new Set(
      ["CHAR-001", "CHAR-002", "CHAR-003", "CHAR-004", "CHAR-005"],
    );
    if (
      existingProfiles.some(
        (profile) =>
          !legacyCodes.has(profile.characterCode) ||
          profile.storyline !== undefined,
      )
    ) {
      throw new Error(
        "Unexpected profile data found. No profile records were changed.",
      );
    }

    startedAt = new Date();
    oldProfiles = existingProfiles.map((profile) => ({
      characterCode: profile.characterCode,
      _id: profile._id,
    }));
    await migrationsCollection.insertOne({
      _id: migrationId,
      status: "in_progress",
      startedAt,
      oldProfiles,
    });
  }

  let snapshotCount = 0;
  for (const oldProfile of oldProfiles) {
    const profile = await profilesCollection.findOne({ _id: oldProfile._id });
    if (!profile) continue;

    const { _id, createdAt, updatedAt, __v, ...characterSnapshot } = profile;
    const linkedSessions = await sessionsCollection
      .find({ characterId: oldProfile._id })
      .toArray();
    for (const gameSession of linkedSessions) {
      if (gameSession.characterSnapshot) continue;
      const result = await sessionsCollection.updateOne(
        { _id: gameSession._id, characterSnapshot: { $exists: false } },
        {
          $set: {
            characterSnapshot,
            gameVersion: gameSession.gameVersion ?? "legacy-v1",
          },
        },
      );
      snapshotCount += result.modifiedCount;
    }

    const missingSnapshot = await sessionsCollection.countDocuments({
      characterId: oldProfile._id,
      characterSnapshot: { $exists: false },
    });
    if (missingSnapshot > 0) {
      throw new Error(
        `Could not preserve all sessions for ${oldProfile.characterCode}.`,
      );
    }
  }

  if (oldProfiles.length > 0) {
    const oldIds = oldProfiles.map((profile) => profile._id);
    await profilesCollection.deleteMany({ _id: { $in: oldIds } });
  }

  let insertedCount = 0;
  for (const profile of profilesWithStorylines) {
    const result = await profilesCollection.updateOne(
      { characterCode: profile.characterCode },
      {
        $setOnInsert: {
          ...profile,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );
    insertedCount += result.upsertedCount;
  }

  const importedProfiles = await profilesCollection
    .find({}, { projection: { characterCode: 1, storyline: 1 } })
    .toArray();
  const importedCodes = new Set(
    importedProfiles.map((profile) => profile.characterCode),
  );
  if (
    importedProfiles.length !== 20 ||
    importedCodes.size !== 20 ||
    importedProfiles.some((profile) => !profile.storyline)
  ) {
    throw new Error("Imported character profiles failed verification.");
  }

  await migrationsCollection.updateOne(
    { _id: migrationId },
    {
      $set: {
        status: "completed",
        completedAt: new Date(),
      },
    },
  );

  console.log(
    `Character profile import complete: ${insertedCount} inserted, ${oldProfiles.length} old profiles removed, ${snapshotCount} session snapshots preserved.`,
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
