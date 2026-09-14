/**
 * High-Performance In-Memory Cache with TTL & Pattern Invalidation
 * Dramatically accelerates response times on Vercel by eliminating redundant network hops to TiDB.
 */

type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<any>>();

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlSeconds: number = 60): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  });
}

export function invalidateCache(keyOrPattern: string): void {
  if (keyOrPattern.includes('*')) {
    const regex = new RegExp('^' + keyOrPattern.replace(/\*/g, '.*') + '$');
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
      }
    }
  } else {
    for (const key of cache.keys()) {
      if (key === keyOrPattern || key.startsWith(keyOrPattern)) {
        cache.delete(key);
      }
    }
  }
}

export function clearAllCache(): void {
  cache.clear();
}
