import { Database } from '../../src/data/Database';
import { InMemoryDataTable } from '../../src/data/InMemoryDataTable';

describe('Database', () => {
    beforeEach(() => {
        Database.reInitialize();
    });

    describe('singleton', () => {
        it('should return the same instance', () => {
            const db1 = Database.getInstance();
            const db2 = Database.getInstance();
            expect(db1).toBe(db2);
        });

        it('should return a new instance after reInitialize', () => {
            const db1 = Database.getInstance();
            db1.addTable('test_table');
            Database.reInitialize();
            const db2 = Database.getInstance();
            expect(db2.getTable('test_table')).toBeUndefined();
        });
    });

    describe('addTable', () => {
        it('should create a new table', () => {
            const table = Database.getInstance().addTable('incident');
            expect(table).toBeInstanceOf(InMemoryDataTable);
            expect(table.tableName).toBe('incident');
        });

        it('should return existing table if already added', () => {
            const table1 = Database.getInstance().addTable('incident');
            table1.addRow({ sys_id: '1', name: 'test' });
            const table2 = Database.getInstance().addTable('incident');
            expect(table2).toBe(table1);
            expect(table2.getRows().length).toBe(1);
        });
    });

    describe('getTable', () => {
        it('should return undefined for non-existent table', () => {
            expect(Database.getInstance().getTable('nonexistent')).toBeUndefined();
        });

        it('should return the table after it has been added', () => {
            Database.getInstance().addTable('cmdb_ci');
            const table = Database.getInstance().getTable('cmdb_ci');
            expect(table).toBeDefined();
            expect(table.tableName).toBe('cmdb_ci');
        });
    });

    describe('getMockData', () => {
        it('should return empty object initially', () => {
            const data = Database.getInstance().getMockData();
            expect(Object.keys(data).length).toBe(0);
        });

        it('should contain all added tables', () => {
            Database.getInstance().addTable('incident');
            Database.getInstance().addTable('problem');
            Database.getInstance().addTable('change_request');
            const data = Database.getInstance().getMockData();
            expect(Object.keys(data)).toEqual(['incident', 'problem', 'change_request']);
        });
    });
});
