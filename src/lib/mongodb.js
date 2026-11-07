import mongoose from "mongoose";

const mongooseCache = globalThis.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalThis.mongooseCache = mongooseCache;

export default async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    const error = new Error(
      "Missing MONGODB_URI. Add it to your local environment.",
    );
    error.code = "MONGODB_URI_MISSING";
    throw error;
  }

  if (mongooseCache.connection) {
    return mongooseCache.connection;
  }

  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose.connect(mongoUri).catch((error) => {
      mongooseCache.promise = null;
      throw error;
    });
  }

  mongooseCache.connection = await mongooseCache.promise;
  return mongooseCache.connection;
}
