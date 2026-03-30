import mongoose from "mongoose";

// Next.js hot reload me multiple connections se bachne ke liye global cache
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
  // eslint-disable-next-line no-var
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

let cached = global._mongooseConn;
let cachedPromise = global._mongoosePromise;

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined in .env.local");

  if (cached) return cached;

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  try {
    cached = await cachedPromise;
    global._mongooseConn = cached;
    global._mongoosePromise = cachedPromise;
    return cached;
  } catch (err) {
    cachedPromise = null;
    throw err;
  }
}
