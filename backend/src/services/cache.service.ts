import logger from '../lib/logger';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTtlMs: number;
  private maxItems: number;
  private hits = 0;
  private misses = 0;

  constructor(defaultTtlSeconds = 300, maxItems = 500) {
    this.defaultTtlMs = defaultTtlSeconds * 1000;
    this.maxItems = maxItems;

    // Periodic cleanup of expired keys every 60 seconds
    setInterval(() => this.cleanupExpired(), 60_000).unref();
  }

  /**
   * Get value from cache if present and not expired
   */
  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.value as T;
  }

  /**
   * Set key-value pair with optional custom TTL in seconds
   */
  public set<T>(key: string, value: T, ttlSeconds?: number): void {
    // Evict oldest item if capacity reached
    if (this.cache.size >= this.maxItems) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTtlMs;
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Delete a specific cache key
   */
  public del(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Flush all keys matching a prefix (e.g. "products:")
   */
  public flushByPrefix(prefix: string): void {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    if (count > 0) {
      logger.info({ prefix, count }, '[CacheService] Flushed keys by prefix');
    }
  }

  /**
   * Clear entire cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) + '%' : '0%';
    return {
      driver: 'memory',
      size: this.cache.size,
      maxCapacity: this.maxItems,
      hits: this.hits,
      misses: this.misses,
      hitRate,
    };
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheService = new CacheService(300, 500); // 5 min default TTL, 500 max keys
