import { MockGlideSystem, mockGs, gs, newMockGlideSystem } from '../../src/@servicenow/glide/MockGlideSystem';
import { Database } from '../../src/data/Database';
import { PropertyDB } from '../../src/data/PropertyDB';

describe('MockGlideSystem', () => {
    let gsInstance: MockGlideSystem;

    beforeEach(() => {
        Database.reInitialize();
        gsInstance = new MockGlideSystem();
    });

    describe('constructor', () => {
        it('should create a sys_properties table in the database', () => {
            const table = Database.getInstance().getTable('sys_properties');
            expect(table).toBeDefined();
        });
    });

    describe('getProperty / setProperty', () => {
        it('should set and retrieve a property', () => {
            gsInstance.setProperty('my.app.feature', 'enabled');
            expect(gsInstance.getProperty('my.app.feature')).toBe('enabled');
        });

        it('should return undefined for non-existent property', () => {
            expect(gsInstance.getProperty('nonexistent')).toBeUndefined();
        });

        it('should overwrite existing property', () => {
            gsInstance.setProperty('my.setting', 'old');
            gsInstance.setProperty('my.setting', 'new');
            expect(gsInstance.getProperty('my.setting')).toBe('new');
        });
    });

    describe('logging methods', () => {
        it('log should not throw', () => {
            expect(() => gsInstance.log('test message')).not.toThrow();
        });

        it('error should not throw', () => {
            expect(() => gsInstance.error('error message')).not.toThrow();
        });

        it('warn should not throw', () => {
            expect(() => gsInstance.warn('warning message')).not.toThrow();
        });

        it('debug should not throw', () => {
            expect(() => gsInstance.debug('debug message')).not.toThrow();
        });

        it('info should not throw', () => {
            expect(() => gsInstance.info('info message')).not.toThrow();
        });
    });

    describe('getUserName', () => {
        it('should return admin', () => {
            expect(gsInstance.getUserName()).toBe('admin');
        });
    });

    describe('getSystemId', () => {
        it('should return admin', () => {
            expect(gsInstance.getSystemId()).toBe('admin');
        });
    });

    describe('nil', () => {
        it('should return true for null', () => {
            expect(gsInstance.nil(null)).toBe(true);
        });

        it('should return true for undefined', () => {
            expect(gsInstance.nil(undefined)).toBe(true);
        });

        it('should return true for empty string', () => {
            expect(gsInstance.nil('')).toBe(true);
        });

        it('should return true for 0', () => {
            expect(gsInstance.nil(0)).toBe(true);
        });

        it('should return false for non-empty string', () => {
            expect(gsInstance.nil('hello')).toBe(false);
        });

        it('should return false for truthy values', () => {
            expect(gsInstance.nil(1)).toBe(false);
            expect(gsInstance.nil(true)).toBe(false);
            expect(gsInstance.nil({})).toBe(false);
        });
    });

    describe('urlEncode', () => {
        it('should encode spaces', () => {
            expect(gsInstance.urlEncode('hello world')).toBe('hello%20world');
        });

        it('should encode special characters', () => {
            expect(gsInstance.urlEncode('a=b&c=d')).toBe('a%3Db%26c%3Dd');
        });
    });

    describe('importXML', () => {
        it('should return the input string', () => {
            const xml = '<root><item>test</item></root>';
            expect(gsInstance.importXML(xml)).toBe(xml);
        });
    });

    describe('include', () => {
        it('should return empty string', () => {
            expect(gsInstance.include('SomeScriptInclude')).toBe('');
        });
    });

    describe('eventQueue', () => {
        it('should not throw', () => {
            expect(() => {
                gsInstance.eventQueue('incident.created', null as any, 'parm1', 'parm2', 'queue');
            }).not.toThrow();
        });
    });

    describe('exported singletons', () => {
        it('mockGs should be an instance of MockGlideSystem', () => {
            expect(mockGs).toBeInstanceOf(MockGlideSystem);
        });

        it('gs should be the same as mockGs', () => {
            expect(gs).toBe(mockGs);
        });
    });

    describe('newMockGlideSystem factory', () => {
        it('should return a new instance', () => {
            const instance = newMockGlideSystem();
            expect(instance).toBeInstanceOf(MockGlideSystem);
        });
    });
});
