export class CacheService {
  // Safe in-memory store fallback requiring no local installations
  private static memoryStore = new Map<string, { value: string; expiresAt: number }>();

  public async get<T>(key: string): Promise<T | null> {
    const record = CacheService.memoryStore.get(key);
    if (!record) return null;

    // Check if the cache key has expired
    if (Date.now() > record.expiresAt) {
      CacheService.memoryStore.delete(key);
      return null;
    }

    return JSON.parse(record.value) as T;
  }

  public async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    CacheService.memoryStore.set(key, {
      value: JSON.stringify(value),
      expiresAt
    });
  }

  public async del(key: string): Promise<void> {
    CacheService.memoryStore.delete(key);
  }

  public async invalidatePattern(pattern: string): Promise<void> {
    // Transform redis wildcard pattern (e.g., "tenant:123*") into a regex check
    const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*'));
    
    for (const key of CacheService.memoryStore.keys()) {
      if (regexPattern.test(key)) {
        CacheService.memoryStore.delete(key);
      }
    }
  }

  public static buildTenantKey(tenantId: string, module: string, identifier: string): string {
    return `tenant:${tenantId}:${module}:${identifier}`;
  }
}