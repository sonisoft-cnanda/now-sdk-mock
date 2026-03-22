import { InMemoryDataTable } from '../../src/data/InMemoryDataTable';

describe('InMemoryDataTable', () => {
    let table: InMemoryDataTable;

    beforeEach(() => {
        table = new InMemoryDataTable('incident');
    });

    describe('constructor', () => {
        it('should set table name', () => {
            expect(table.tableName).toBe('incident');
        });

        it('should start with empty rows', () => {
            expect(table.getRows()).toEqual([]);
        });

        it('should start with empty business rules', () => {
            expect(table.businessRules).toEqual([]);
        });
    });

    describe('addRow', () => {
        it('should add a single row', () => {
            table.addRow({ sys_id: 'abc123', short_description: 'Test' });
            expect(table.getRows().length).toBe(1);
            expect(table.getRows()[0].sys_id).toBe('abc123');
        });

        it('should add multiple rows one at a time', () => {
            table.addRow({ sys_id: '1' });
            table.addRow({ sys_id: '2' });
            table.addRow({ sys_id: '3' });
            expect(table.getRows().length).toBe(3);
        });
    });

    describe('addRows', () => {
        it('should add multiple rows at once', () => {
            table.addRows([
                { sys_id: '1', name: 'first' },
                { sys_id: '2', name: 'second' },
                { sys_id: '3', name: 'third' },
            ]);
            expect(table.getRows().length).toBe(3);
        });

        it('should append to existing rows', () => {
            table.addRow({ sys_id: '0' });
            table.addRows([{ sys_id: '1' }, { sys_id: '2' }]);
            expect(table.getRows().length).toBe(3);
        });
    });

    describe('setRows', () => {
        it('should replace all existing rows', () => {
            table.addRow({ sys_id: '1' });
            table.addRow({ sys_id: '2' });
            table.setRows([{ sys_id: 'new' }]);
            expect(table.getRows().length).toBe(1);
            expect(table.getRows()[0].sys_id).toBe('new');
        });
    });

    describe('getRowBySysId', () => {
        beforeEach(() => {
            table.addRows([
                { sys_id: 'abc', name: 'Alpha' },
                { sys_id: 'def', name: 'Bravo' },
                { sys_id: 'ghi', name: 'Charlie' },
            ]);
        });

        it('should find a row by sys_id', () => {
            const row = table.getRowBySysId('def');
            expect(row).toBeDefined();
            expect(row!.name).toBe('Bravo');
        });

        it('should return undefined for non-existent sys_id', () => {
            expect(table.getRowBySysId('zzz')).toBeUndefined();
        });
    });

    describe('getRowByField', () => {
        beforeEach(() => {
            table.addRows([
                { sys_id: '1', priority: '1', category: 'hardware' },
                { sys_id: '2', priority: '2', category: 'software' },
                { sys_id: '3', priority: '1', category: 'network' },
            ]);
        });

        it('should find first row matching field value', () => {
            const row = table.getRowByField('category', 'software');
            expect(row).toBeDefined();
            expect(row!.sys_id).toBe('2');
        });

        it('should return first match when multiple rows match', () => {
            const row = table.getRowByField('priority', '1');
            expect(row).toBeDefined();
            expect(row!.sys_id).toBe('1');
        });

        it('should return undefined when no rows match', () => {
            expect(table.getRowByField('category', 'database')).toBeUndefined();
        });
    });

    describe('deleteRowBySysId', () => {
        beforeEach(() => {
            table.addRows([
                { sys_id: '1', name: 'A' },
                { sys_id: '2', name: 'B' },
                { sys_id: '3', name: 'C' },
            ]);
        });

        it('should delete the row with the given sys_id', () => {
            table.deleteRowBySysId('2');
            expect(table.getRows().length).toBe(2);
            expect(table.getRowBySysId('2')).toBeUndefined();
        });

        it('should not affect other rows', () => {
            table.deleteRowBySysId('2');
            expect(table.getRowBySysId('1')).toBeDefined();
            expect(table.getRowBySysId('3')).toBeDefined();
        });

        it('should do nothing for non-existent sys_id', () => {
            table.deleteRowBySysId('999');
            expect(table.getRows().length).toBe(3);
        });
    });

    describe('deleteRowByField', () => {
        beforeEach(() => {
            table.addRows([
                { sys_id: '1', priority: '1' },
                { sys_id: '2', priority: '2' },
                { sys_id: '3', priority: '1' },
            ]);
        });

        it('should delete all rows matching the field value', () => {
            table.deleteRowByField('priority', '1');
            expect(table.getRows().length).toBe(1);
            expect(table.getRows()[0].sys_id).toBe('2');
        });

        it('should do nothing when no rows match', () => {
            table.deleteRowByField('priority', '5');
            expect(table.getRows().length).toBe(3);
        });
    });

    describe('tableName getter/setter', () => {
        it('should allow updating the table name', () => {
            table.tableName = 'problem';
            expect(table.tableName).toBe('problem');
        });
    });

    describe('rows getter/setter', () => {
        it('should get and set rows directly', () => {
            const rows = [{ sys_id: 'x' }, { sys_id: 'y' }];
            table.rows = rows;
            expect(table.rows).toBe(rows);
            expect(table.rows.length).toBe(2);
        });
    });
});
