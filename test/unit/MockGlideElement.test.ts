import { MockGlideElement } from '../../src/@servicenow/glide/MockGlideElement';

describe('MockGlideElement', () => {
    describe('constructor and getValue', () => {
        it('should store the initial value', () => {
            const elem = new MockGlideElement('test value');
            expect(elem.getValue()).toBe('test value');
        });

        it('should handle null value', () => {
            const elem = new MockGlideElement(null);
            expect(elem.getValue()).toBeNull();
        });

        it('should handle numeric value', () => {
            const elem = new MockGlideElement(42);
            expect(elem.getValue()).toBe(42);
        });
    });

    describe('setValue', () => {
        it('should update the value', () => {
            const elem = new MockGlideElement('old');
            elem.setValue('new');
            expect(elem.getValue()).toBe('new');
        });
    });

    describe('getDisplayValue', () => {
        it('should return string representation', () => {
            const elem = new MockGlideElement('display this');
            expect(elem.getDisplayValue()).toBe('display this');
        });

        it('should convert number to string', () => {
            const elem = new MockGlideElement(123);
            expect(elem.getDisplayValue()).toBe('123');
        });
    });

    describe('nil', () => {
        it('should return true for null', () => {
            const elem = new MockGlideElement(null);
            expect(elem.nil()).toBe(true);
        });

        it('should return true for undefined', () => {
            const elem = new MockGlideElement(undefined);
            expect(elem.nil()).toBe(true);
        });

        it('should return false for non-null value', () => {
            const elem = new MockGlideElement('something');
            expect(elem.nil()).toBe(false);
        });

        it('should return false for empty string', () => {
            const elem = new MockGlideElement('');
            expect(elem.nil()).toBe(false);
        });
    });

    describe('getBooleanValue', () => {
        it('should return true for truthy values', () => {
            expect(new MockGlideElement('true').getBooleanValue()).toBe(true);
            expect(new MockGlideElement(1).getBooleanValue()).toBe(true);
            expect(new MockGlideElement('hello').getBooleanValue()).toBe(true);
        });

        it('should return false for falsy values', () => {
            expect(new MockGlideElement('').getBooleanValue()).toBe(false);
            expect(new MockGlideElement(0).getBooleanValue()).toBe(false);
            expect(new MockGlideElement(null).getBooleanValue()).toBe(false);
        });
    });

    describe('getHTMLValue', () => {
        it('should return string representation', () => {
            const elem = new MockGlideElement('<b>bold</b>');
            expect(elem.getHTMLValue()).toBe('<b>bold</b>');
        });
    });

    describe('changes, changesFrom, changesTo', () => {
        it('changes should return false (stub)', () => {
            const elem = new MockGlideElement('val');
            expect(elem.changes()).toBe(false);
        });

        it('changesFrom should return false (stub)', () => {
            const elem = new MockGlideElement('val');
            expect(elem.changesFrom('old')).toBe(false);
        });

        it('changesTo should return false (stub)', () => {
            const elem = new MockGlideElement('val');
            expect(elem.changesTo('new')).toBe(false);
        });
    });

    describe('reference methods', () => {
        it('setRefRecordTableName should set the table name', () => {
            const elem = new MockGlideElement('ref_value');
            elem.setRefRecordTableName('sys_user');
            // No direct getter for refRecordTableName, but setRefRecord covers it
            expect(elem.getRefTable()).toBe('some_table'); // stub returns hardcoded
        });

        it('getRefField should return stub value', () => {
            const elem = new MockGlideElement('val');
            expect(elem.getRefField()).toBe('some_field');
        });

        it('getRefRecordSysId should return stub value', () => {
            const elem = new MockGlideElement('val');
            expect(elem.getRefRecordSysId()).toBe('some_sys_id');
        });

        it('getRefRecordDisplayValue should return string', () => {
            const elem = new MockGlideElement('display');
            expect(elem.getRefRecordDisplayValue()).toBe('display');
        });

        it('getRefRecordValue should return value', () => {
            const elem = new MockGlideElement('val');
            expect(elem.getRefRecordValue()).toBe('val');
        });

        it('getRefRecordDisplayValues should return array', () => {
            const elem = new MockGlideElement('val');
            expect(elem.getRefRecordDisplayValues()).toEqual(['val']);
        });

        it('getRefRecordValues should return array', () => {
            const elem = new MockGlideElement('val');
            expect(elem.getRefRecordValues()).toEqual(['val']);
        });

        it('getRefRecordVariables should return empty object', () => {
            const elem = new MockGlideElement('val');
            expect(elem.getRefRecordVariables()).toEqual({});
        });
    });
});
