import { MockScopedCacheManager } from '../../src/cache/MockScopedCacheManager';

describe('MockScopedCacheManager', () => {
    beforeEach(() => {
        // Flush all catalogs we use in tests
        MockScopedCacheManager.flushScopedCache('testCatalog');
        MockScopedCacheManager.flushScopedCache('catalog1');
        MockScopedCacheManager.flushScopedCache('catalog2');
    });

    describe('put and get', () => {
        it('should store and retrieve a value', () => {
            MockScopedCacheManager.put('testCatalog', 'key1', 'value1');
            expect(MockScopedCacheManager.get('testCatalog', 'key1')).toBe('value1');
        });

        it('should return null for non-existent key', () => {
            expect(MockScopedCacheManager.get('testCatalog', 'missing')).toBeNull();
        });

        it('should return null for non-existent catalog', () => {
            expect(MockScopedCacheManager.get('nonexistent', 'key')).toBeNull();
        });

        it('should overwrite existing value', () => {
            MockScopedCacheManager.put('testCatalog', 'key1', 'old');
            MockScopedCacheManager.put('testCatalog', 'key1', 'new');
            expect(MockScopedCacheManager.get('testCatalog', 'key1')).toBe('new');
        });

        it('should store in separate catalogs independently', () => {
            MockScopedCacheManager.put('catalog1', 'key', 'val1');
            MockScopedCacheManager.put('catalog2', 'key', 'val2');
            expect(MockScopedCacheManager.get('catalog1', 'key')).toBe('val1');
            expect(MockScopedCacheManager.get('catalog2', 'key')).toBe('val2');
        });
    });

    describe('flushScopedCache', () => {
        it('should flush a specific key', () => {
            MockScopedCacheManager.put('testCatalog', 'key1', 'val1');
            MockScopedCacheManager.put('testCatalog', 'key2', 'val2');
            MockScopedCacheManager.flushScopedCache('testCatalog', 'key1');

            expect(MockScopedCacheManager.get('testCatalog', 'key1')).toBeNull();
            expect(MockScopedCacheManager.get('testCatalog', 'key2')).toBe('val2');
        });

        it('should flush entire catalog when no key specified', () => {
            MockScopedCacheManager.put('testCatalog', 'key1', 'val1');
            MockScopedCacheManager.put('testCatalog', 'key2', 'val2');
            MockScopedCacheManager.flushScopedCache('testCatalog');

            expect(MockScopedCacheManager.get('testCatalog', 'key1')).toBeNull();
            expect(MockScopedCacheManager.get('testCatalog', 'key2')).toBeNull();
        });
    });

    describe('prefixFlush', () => {
        it('should flush all keys with the given prefix', () => {
            MockScopedCacheManager.put('testCatalog', 'user:1', 'Alice');
            MockScopedCacheManager.put('testCatalog', 'user:2', 'Bob');
            MockScopedCacheManager.put('testCatalog', 'group:1', 'Admins');

            MockScopedCacheManager.prefixFlush('testCatalog', 'user:');

            expect(MockScopedCacheManager.get('testCatalog', 'user:1')).toBeNull();
            expect(MockScopedCacheManager.get('testCatalog', 'user:2')).toBeNull();
            expect(MockScopedCacheManager.get('testCatalog', 'group:1')).toBe('Admins');
        });
    });

    describe('getCacheEntryDetails', () => {
        it('should return details for existing entry', () => {
            MockScopedCacheManager.put('testCatalog', 'key1', 'hello');
            const details = MockScopedCacheManager.getCacheEntryDetails('testCatalog', 'key1');
            expect(details).toBe('java.lang.String (5): hello');
        });

        it('should return null string for non-existent entry', () => {
            const details = MockScopedCacheManager.getCacheEntryDetails('testCatalog', 'missing');
            expect(details).toBe('null');
        });
    });

    describe('putMultiRow', () => {
        it('should store the value (ids not tracked)', () => {
            MockScopedCacheManager.putMultiRow('testCatalog', 'key1', 'multi_value', ['id1', 'id2']);
            expect(MockScopedCacheManager.get('testCatalog', 'key1')).toBe('multi_value');
        });
    });

    describe('putRow', () => {
        it('should store the value (sysId not tracked)', () => {
            MockScopedCacheManager.putRow('testCatalog', 'key1', 'row_value', 'sys_id_123');
            expect(MockScopedCacheManager.get('testCatalog', 'key1')).toBe('row_value');
        });
    });
});
