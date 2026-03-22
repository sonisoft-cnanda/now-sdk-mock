import { MockGlideAggregate } from '../../src/@servicenow/glide/MockGlideAggregate';
import { Database } from '../../src/data/Database';
import { SNTestEnvironment } from '../../src/common/SNTestEnvironment';
import * as path from 'path';

const glideDeclarationPath = path.resolve(__dirname, 'glide.server.d.ts');
SNTestEnvironment.getInstance().init(false, path.dirname(glideDeclarationPath), path.basename(glideDeclarationPath));

describe('MockGlideAggregate', () => {
    beforeEach(() => {
        Database.reInitialize();
    });

    it('should extend MockGlideRecord', () => {
        const ga = new MockGlideAggregate('incident');
        expect(ga.getTableName()).toBe('incident');
    });

    it('should support groupBy', () => {
        const ga = new MockGlideAggregate('incident');
        const result = ga.groupBy('category');
        expect(ga.groupByVal).toBe('category');
    });

    it('should return this from groupBy for chaining', () => {
        const ga = new MockGlideAggregate('incident');
        const result = ga.groupBy('category');
        expect(result).toBe(ga);
    });

    it('should support query and next from parent class', () => {
        const table = Database.getInstance().addTable('incident');
        table.addRows([
            { sys_id: '1', category: 'hardware' },
            { sys_id: '2', category: 'software' },
        ]);

        const ga = new MockGlideAggregate('incident');
        ga.query();
        expect(ga.next()).toBe(true);
        expect(ga.next()).toBe(true);
        expect(ga.next()).toBe(false);
    });
});
