/**
 * Simple In-Memory Cache with TTL support
 */
export class SimpleCache<T> {
  private cache: Map<string, { value: T; expiresAt: number }> = new Map();

  constructor(private ttlMs: number) {}

  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return cached.value;
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}
