import { MockGlideRecord } from '../../src/@servicenow/glide/MockGlideRecord';
import { MockGlideElement } from '../../src/@servicenow/glide/MockGlideElement';
import { Database } from '../../src/data/Database';
import { DataTableBusinessRule } from '../../src/data/DataTableBusinessRule';
import { BusinessRuleRunWhen } from '../../src/data/BusinessRuleRunWhen';
import { BusinessRuleRunType } from '../../src/data/BusinessRuleRunType';
import { SNTestEnvironment } from '../../src/common/SNTestEnvironment';
import * as path from 'path';

// Initialize test environment with the test glide declarations
const glideDeclarationPath = path.resolve(__dirname, 'glide.server.d.ts');
SNTestEnvironment.getInstance().init(false, path.dirname(glideDeclarationPath), path.basename(glideDeclarationPath));

// Helper to create a row with MockGlideElement-wrapped values (matching how GlideRecord stores data internally).
// sys_id is stored as a plain string for getRowBySysId lookups, but also as a MockGlideElement for getValue('sys_id').
function mockRow(fields: Record<string, any>): Record<string, any> {
    const row: Record<string, any> = {};
    for (const [key, value] of Object.entries(fields)) {
        row[key] = new MockGlideElement(value);
    }
    // Keep sys_id as plain string too, since InMemoryDataTable.getRowBySysId checks row.sys_id === sysId
    if (fields.sys_id !== undefined) {
        row.sys_id = fields.sys_id;
    }
    return row;
}

describe('MockGlideRecord', () => {
    beforeEach(() => {
        Database.reInitialize();
    });

    describe('constructor', () => {
        it('should set the table name', () => {
            const gr = new MockGlideRecord('incident');
            expect(gr.getTableName()).toBe('incident');
        });

        it('should generate a sys_id for new records', () => {
            const gr = new MockGlideRecord('incident');
            expect(gr.mockNew.sys_id).toBeDefined();
            expect(gr.mockNew.sys_id.length).toBeGreaterThan(0);
        });

        it('should start as a new record', () => {
            const gr = new MockGlideRecord('incident');
            expect(gr.isNewRecord()).toBe(true);
        });

        it('should start with an empty query array', () => {
            const gr = new MockGlideRecord('incident');
            expect(gr.mockQuery).toEqual([]);
        });
    });

    describe('insert', () => {
        it('should insert a record and return sys_id', () => {
            Database.getInstance().addTable('incident');
            const gr = new MockGlideRecord('incident');
            gr.setValue('short_description', 'Test incident');
            const sysId = gr.insert();

            expect(sysId).toBeDefined();
            expect(sysId).not.toBeNull();
        });

        it('should persist the record in the database', () => {
            const table = Database.getInstance().addTable('incident');
            const gr = new MockGlideRecord('incident');
            gr.setValue('short_description', 'Persisted incident');
            gr.insert();

            const rows = table.getRows();
            expect(rows.length).toBe(1);
        });

        it('should set operation to insert', () => {
            Database.getInstance().addTable('incident');
            const gr = new MockGlideRecord('incident');
            gr.setValue('short_description', 'Test');
            gr.insert();
            expect(gr.operation()).toBe('insert');
        });

        it('should fire BEFORE business rules on insert', () => {
            const table = Database.getInstance().addTable('incident');
            const brType = new BusinessRuleRunType();
            brType.insert = true;
            brType.update = false;
            brType.delete = false;
            brType.query = false;

            const mockFn = jest.fn();
            const rule = new DataTableBusinessRule('test BR', BusinessRuleRunWhen.BEFORE, brType, mockFn);
            table.businessRules.push(rule);

            const gr = new MockGlideRecord('incident');
            gr.setValue('short_description', 'Test');
            gr.insert();

            expect(mockFn).toHaveBeenCalled();
        });

        it('should fire AFTER business rules on insert', () => {
            const table = Database.getInstance().addTable('incident');
            const brType = new BusinessRuleRunType();
            brType.insert = true;
            brType.update = false;
            brType.delete = false;
            brType.query = false;

            const mockFn = jest.fn();
            const rule = new DataTableBusinessRule('after BR', BusinessRuleRunWhen.AFTER, brType, mockFn);
            table.businessRules.push(rule);

            const gr = new MockGlideRecord('incident');
            gr.setValue('short_description', 'Test');
            gr.insert();

            expect(mockFn).toHaveBeenCalled();
        });

        it('should NOT fire business rules for non-insert operations', () => {
            const table = Database.getInstance().addTable('incident');
            const brType = new BusinessRuleRunType();
            brType.insert = false;
            brType.update = true;
            brType.delete = false;
            brType.query = false;

            const mockFn = jest.fn();
            const rule = new DataTableBusinessRule('update only BR', BusinessRuleRunWhen.BEFORE, brType, mockFn);
            table.businessRules.push(rule);

            const gr = new MockGlideRecord('incident');
            gr.setValue('short_description', 'Test');
            gr.insert();

            expect(mockFn).not.toHaveBeenCalled();
        });
    });

    describe('get', () => {
        it('should retrieve a record by sys_id', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRow(mockRow({ sys_id: 'abc123', short_description: 'Server down' }));

            const gr = new MockGlideRecord('incident');
            const result = gr.get('abc123');

            expect(result).toBeDefined();
            expect(gr.getValue('short_description')).toBe('Server down');
        });

        it('should return undefined for non-existent sys_id', () => {
            Database.getInstance().addTable('incident');
            const gr = new MockGlideRecord('incident');
            const result = gr.get('nonexistent');
            expect(result).toBeUndefined();
        });

        it('should mark record as not new after get', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRow(mockRow({ sys_id: 'abc123' }));

            const gr = new MockGlideRecord('incident');
            gr.get('abc123');
            expect(gr.isNewRecord()).toBe(false);
        });
    });

    describe('query and next', () => {
        beforeEach(() => {
            const table = Database.getInstance().addTable('incident');
            table.addRows([
                mockRow({ sys_id: '1', short_description: 'First' }),
                mockRow({ sys_id: '2', short_description: 'Second' }),
                mockRow({ sys_id: '3', short_description: 'Third' }),
            ]);
        });

        it('should iterate through all records', () => {
            const gr = new MockGlideRecord('incident');
            gr.query();

            const descriptions: string[] = [];
            while (gr.next()) {
                descriptions.push(gr.getValue('short_description'));
            }
            expect(descriptions).toEqual(['First', 'Second', 'Third']);
        });

        it('should return false when no more records', () => {
            const gr = new MockGlideRecord('incident');
            gr.query();
            gr.next(); // 1
            gr.next(); // 2
            gr.next(); // 3
            expect(gr.next()).toBe(false);
        });

        it('should mark record as not new after query', () => {
            const gr = new MockGlideRecord('incident');
            gr.query();
            expect(gr.isNewRecord()).toBe(false);
        });
    });

    describe('hasNext', () => {
        it('should return true when more records exist', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRows([{ sys_id: '1' }, { sys_id: '2' }]);

            const gr = new MockGlideRecord('incident');
            gr.query();
            gr.next();
            expect(gr.hasNext()).toBe(true);
        });

        it('should return false at the last record', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRow({ sys_id: '1' });

            const gr = new MockGlideRecord('incident');
            gr.query();
            gr.next();
            expect(gr.hasNext()).toBe(false);
        });
    });

    describe('setLimit', () => {
        it('should limit the number of records returned by query', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRows([
                { sys_id: '1' },
                { sys_id: '2' },
                { sys_id: '3' },
                { sys_id: '4' },
                { sys_id: '5' },
            ]);

            const gr = new MockGlideRecord('incident');
            gr.setLimit(2);
            gr.query();

            let count = 0;
            while (gr.next()) count++;
            expect(count).toBe(2);
        });
    });

    describe('setValue and getValue', () => {
        it('should set and get values', () => {
            Database.getInstance().addTable('incident');
            const gr = new MockGlideRecord('incident');
            gr.setValue('short_description', 'Hello');
            expect(gr.getValue('short_description')).toBe('Hello');
        });

        it('should store values as MockGlideElement internally', () => {
            Database.getInstance().addTable('incident');
            const gr = new MockGlideRecord('incident');
            gr.setValue('category', 'hardware');
            // getValue returns the string value via MockGlideElement.getValue()
            expect(gr.getValue('category')).toBe('hardware');
        });
    });

    describe('getElement', () => {
        it('should return a MockGlideElement for existing field', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRow(mockRow({ sys_id: '1', short_description: 'Test' }));

            const gr = new MockGlideRecord('incident');
            gr.get('1');
            const elem = gr.getElement('short_description');
            expect(elem).toBeDefined();
            expect(elem!.getValue()).toBe('Test');
        });

        it('should return null for non-existent field', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRow(mockRow({ sys_id: '1' }));

            const gr = new MockGlideRecord('incident');
            gr.get('1');
            expect(gr.getElement('nonexistent_field')).toBeNull();
        });
    });

    describe('getUniqueValue', () => {
        it('should return the sys_id of an inserted record', () => {
            Database.getInstance().addTable('incident');
            const gr = new MockGlideRecord('incident');
            gr.setValue('short_description', 'Test');
            const sysId = gr.insert();

            // After insert, mockCurrent.sys_id is the plain string sys_id
            expect(gr.mockCurrent.sys_id).toBe(sysId);
        });

        it('should return sys_id from seeded data via mockCurrent', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRow(mockRow({ sys_id: 'unique123', name: 'test' }));

            const gr = new MockGlideRecord('incident');
            gr.get('unique123');
            expect(gr.mockCurrent.sys_id).toBe('unique123');
        });
    });

    describe('update', () => {
        it('should set _mockUpdated flag', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRow(mockRow({ sys_id: '1', short_description: 'Original' }));

            const gr = new MockGlideRecord('incident');
            gr.get('1');
            gr.setValue('short_description', 'Updated');
            const result = gr.update();

            expect(result).toBe('1');
            expect(gr.mockCurrent._mockUpdated).toBe(true);
        });

        it('should set operation to update', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRow(mockRow({ sys_id: '1' }));

            const gr = new MockGlideRecord('incident');
            gr.get('1');
            gr.update();
            expect(gr.operation()).toBe('update');
        });
    });

    describe('addQuery and addEncodedQuery', () => {
        it('should store encoded queries', () => {
            const gr = new MockGlideRecord('incident');
            gr.addEncodedQuery('active=true^priority=1');
            expect(gr.mockQuery).toContain('active=true^priority=1');
        });

        it('should mark record as not new after addEncodedQuery', () => {
            const gr = new MockGlideRecord('incident');
            gr.addEncodedQuery('active=true');
            expect(gr.isNewRecord()).toBe(false);
        });

        it('should return a MockGlideQueryCondition from addQuery', () => {
            const gr = new MockGlideRecord('incident');
            const condition = gr.addQuery('priority', '=', '1');
            expect(condition).toBeDefined();
            expect(condition.getConditions().length).toBe(1);
        });

        it('should store conditions from addQuery', () => {
            const gr = new MockGlideRecord('incident');
            gr.addQuery('priority', '=', '1');
            expect(gr.conditions.length).toBe(1);
        });
    });

    describe('addActiveQuery', () => {
        it('should add active=true query', () => {
            const gr = new MockGlideRecord('incident');
            gr.addActiveQuery();
            expect(gr.mockQuery).toContain('active=true');
        });
    });

    describe('addNotNullQuery', () => {
        it('should add not null query', () => {
            const gr = new MockGlideRecord('incident');
            gr.addNotNullQuery('assignment_group');
            expect(gr.mockQuery).toContain('assignment_group!=NULL');
        });
    });

    describe('addNullQuery', () => {
        it('should return a MockGlideQueryCondition', () => {
            const gr = new MockGlideRecord('incident');
            const condition = gr.addNullQuery('assignment_group');
            expect(condition).toBeDefined();
            expect(condition.getConditions().length).toBe(1);
        });
    });

    describe('getRowCount', () => {
        it('should return the number of records after query', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRows([{ sys_id: '1' }, { sys_id: '2' }, { sys_id: '3' }]);

            const gr = new MockGlideRecord('incident');
            gr.query();
            expect(gr.getRowCount()).toBe(3);
        });
    });

    describe('getRecordClassName', () => {
        it('should return the table name', () => {
            const gr = new MockGlideRecord('incident');
            expect(gr.getRecordClassName()).toBe('incident');
        });
    });

    describe('isValid, isValidField, isValidRecord', () => {
        it('should always return true', () => {
            const gr = new MockGlideRecord('incident');
            expect(gr.isValid()).toBe(true);
            expect(gr.isValidField()).toBe(true);
            expect(gr.isValidRecord()).toBe(true);
        });
    });

    describe('reset', () => {
        it('should reset index to -1', () => {
            const table = Database.getInstance().addTable('incident');
            table.addRows([{ sys_id: '1' }, { sys_id: '2' }]);

            const gr = new MockGlideRecord('incident');
            gr.query();
            gr.next();
            gr.next();
            gr.reset();
            expect(gr.mockIndex).toBe(-1);

            // Should be able to iterate again
            expect(gr.next()).toBe(true);
        });
    });

    describe('deleteMultiple', () => {
        it('should return the GlideRecord instance', () => {
            const gr = new MockGlideRecord('incident');
            expect(gr.deleteMultiple()).toBe(gr);
        });
    });

    describe('setMockData and getMockData', () => {
        it('should set and get mock data', () => {
            const gr = new MockGlideRecord('incident');
            const data = [{ sys_id: '1' }, { sys_id: '2' }];
            gr.setMockData(data);
            expect(gr.getMockData()).toBe(data);
        });
    });

    describe('generateGUID', () => {
        it('should generate unique GUIDs', () => {
            const gr = new MockGlideRecord('incident');
            const guid1 = gr.generateGUID();
            const guid2 = gr.generateGUID();
            expect(guid1).not.toBe(guid2);
        });

        it('should generate GUIDs in UUID format', () => {
            const gr = new MockGlideRecord('incident');
            const guid = gr.generateGUID();
            // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            expect(guid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        });
    });

    describe('multiple inserts', () => {
        it('should create separate records with unique sys_ids', () => {
            const table = Database.getInstance().addTable('incident');

            const gr1 = new MockGlideRecord('incident');
            gr1.setValue('short_description', 'First');
            const id1 = gr1.insert();

            const gr2 = new MockGlideRecord('incident');
            gr2.setValue('short_description', 'Second');
            const id2 = gr2.insert();

            expect(id1).not.toBe(id2);
            expect(table.getRows().length).toBe(2);
        });
    });

    describe('query with no table', () => {
        it('should handle query on non-existent table gracefully', () => {
            const gr = new MockGlideRecord('nonexistent');
            gr.query();
            expect(gr.next()).toBe(false);
        });
    });

    describe('insert and then query back', () => {
        it('should retrieve inserted records via query', () => {
            Database.getInstance().addTable('incident');

            const gr1 = new MockGlideRecord('incident');
            gr1.setValue('short_description', 'Inserted record');
            gr1.setValue('priority', '1');
            const sysId = gr1.insert();

            const gr2 = new MockGlideRecord('incident');
            gr2.query();
            expect(gr2.next()).toBe(true);
            expect(gr2.getValue('short_description')).toBe('Inserted record');
            // sys_id is stored as a plain string (not MockGlideElement), so access via mockCurrent
            expect(gr2.mockCurrent.sys_id).toBe(sysId);
        });
    });
});
