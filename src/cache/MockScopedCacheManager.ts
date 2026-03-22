export class MockScopedCacheManager {
    private static cache: { [catalog: string]: { [key: string]: string } } = {};
  
    static flushScopedCache(catalog: string, key?: string): void {
      if (key) {
        if (MockScopedCacheManager.cache[catalog]) {
          delete MockScopedCacheManager.cache[catalog][key];
        }
      } else {
        delete MockScopedCacheManager.cache[catalog];
      }
    }
  
    static get(catalog: string, key: string): string | null {
      return MockScopedCacheManager.cache[catalog]?.[key] || null;
    }
  
    static getCacheEntryDetails(catalog: string, key: string): string {
      const value = MockScopedCacheManager.get(catalog, key);
      if (value) {
        return `java.lang.String (${value.length}): ${value}`;
      }
      return 'null';
    }
  
    static prefixFlush(catalog: string, prefix: string): void {
      if (MockScopedCacheManager.cache[catalog]) {
        for (const key in MockScopedCacheManager.cache[catalog]) {
          if (key.startsWith(prefix)) {
            delete MockScopedCacheManager.cache[catalog][key];
          }
        }
      }
    }
  
    static put(catalog: string, key: string, value: string): void {
      if (!MockScopedCacheManager.cache[catalog]) {
        MockScopedCacheManager.cache[catalog] = {};
      }
      MockScopedCacheManager.cache[catalog][key] = value;
    }
  
    static putMultiRow(catalog: string, key: string, value: string, ids: string[]): void {
      MockScopedCacheManager.put(catalog, key, value);
      // For simplicity, we are not tracking the ids in this mock implementation
    }
  
    static putRow(catalog: string, key: string, value: string, sysId?: string): void {
      MockScopedCacheManager.put(catalog, key, value);
      // For simplicity, we are not tracking the sysId in this mock implementation
    }
  }
//USAGE:
//   // Mocking the ScopedCacheManager in the test environment
//   jest.mock('@servicenow/glide/sn_scoped_cache', () => ({
//     ScopedCacheManager: MockScopedCacheManager
//   }));