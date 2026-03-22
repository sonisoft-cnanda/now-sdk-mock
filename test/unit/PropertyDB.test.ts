import { PropertyDB } from '../../src/data/PropertyDB';
import { PropertyTable } from '../../src/data/PropertyTable';

describe('PropertyTable', () => {
    let table: PropertyTable;

    beforeEach(() => {
        table = new PropertyTable();
    });

    it('should start empty', () => {
        expect(table.getProperty('anything')).toBeUndefined();
    });

    it('should set and get a property', () => {
        table.setProperty('key', 'value');
        expect(table.getProperty('key')).toBe('value');
    });

    it('should overwrite existing property', () => {
        table.setProperty('key', 'old');
        table.setProperty('key', 'new');
        expect(table.getProperty('key')).toBe('new');
    });

    it('should store multiple properties', () => {
        table.setProperty('a', '1');
        table.setProperty('b', '2');
        table.setProperty('c', '3');
        expect(table.getProperty('a')).toBe('1');
        expect(table.getProperty('b')).toBe('2');
        expect(table.getProperty('c')).toBe('3');
    });
});

describe('PropertyDB', () => {
    it('should be a singleton', () => {
        const db1 = PropertyDB.getInstance();
        const db2 = PropertyDB.getInstance();
        expect(db1).toBe(db2);
    });

    it('should set and get properties', () => {
        const db = PropertyDB.getInstance();
        db.setProperty('test.prop', 'test_value');
        expect(db.getProperty('test.prop')).toBe('test_value');
    });
});
