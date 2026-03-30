/**
 * Redis cache with automatic in-memory fallback.
 * Agar Redis available nahi hai to memory store use hoga silently.
 */

import Redis from "ioredis";

let client: Redis | null = null;
let available = false;

// ─── Memory fallback ─────────────────────────────────────────────────────────
interface MemEntry {
  value: string;
  exp: number; // unix ms
}
const mem = new Map<string, MemEntry>();

function memClean() {
  const now = Date.now();
  mem.forEach((v, k) => {
    if (v.exp < now) mem.delete(k);
  });
}

// ─── Singleton Redis connect ──────────────────────────────────────────────────
export async function connectRedis(): Promise<void> {
  if (client) return;

  const url = process.env.REDIS_URL || "redis://localhost:6379";

  client = new Redis(url, {
    password: process.env.REDIS_PASSWORD || undefined,
    lazyConnect: true,
    connectTimeout: 3000,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  });

  try {
    await client.connect();
    available = true;
    // eslint-disable-next-line no-console
    console.log("[Cache] Redis connected");
  } catch {
    available = false;
    client = null;
    // eslint-disable-next-line no-console
    console.warn("[Cache] Redis unavailable — using memory fallback");
  }

  client?.on("error", () => {
    available = false;
  });
  client?.on("ready", () => {
    available = true;
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function cacheSet(key: string, value: string, ttl: number): Promise<void> {
  if (client && available) {
    await client.setex(key, ttl, value);
    return;
  }
  memClean();
  mem.set(key, { value, exp: Date.now() + ttl * 1000 });
}

export async function cacheGet(key: string): Promise<string | null> {
  if (client && available) return client.get(key);
  const e = mem.get(key);
  if (!e) return null;
  if (e.exp < Date.now()) { mem.delete(key); return null; }
  return e.value;
}

export async function cacheDel(key: string): Promise<void> {
  if (client && available) { await client.del(key); return; }
  mem.delete(key);
}

export async function cacheExists(key: string): Promise<boolean> {
  if (client && available) return (await client.exists(key)) === 1;
  const e = mem.get(key);
  if (!e) return false;
  if (e.exp < Date.now()) { mem.delete(key); return false; }
  return true;
}

/** Increment a counter. Returns new value. */
export async function cacheIncr(key: string, ttlOnCreate: number): Promise<number> {
  if (client && available) {
    const v = await client.incr(key);
    if (v === 1) await client.expire(key, ttlOnCreate);
    return v;
  }
  memClean();
  const e = mem.get(key);
  const now = Date.now();
  if (!e || e.exp < now) {
    mem.set(key, { value: "1", exp: now + ttlOnCreate * 1000 });
    return 1;
  }
  const next = parseInt(e.value, 10) + 1;
  mem.set(key, { value: String(next), exp: e.exp });
  return next;
}

export async function cacheTTL(key: string): Promise<number> {
  if (client && available) return client.ttl(key);
  const e = mem.get(key);
  if (!e) return -2;
  const ttl = Math.floor((e.exp - Date.now()) / 1000);
  return ttl > 0 ? ttl : -2;
}
