import { MockGlideQueryCondition } from '../../src/@servicenow/glide/MockGlideQueryCondition';

describe('MockGlideQueryCondition', () => {
    let condition: MockGlideQueryCondition;

    beforeEach(() => {
        condition = new MockGlideQueryCondition();
    });

    describe('addCondition', () => {
        it('should add a condition', () => {
            condition.addCondition('priority', '=', '1');
            const conditions = condition.getConditions();
            expect(conditions.length).toBe(1);
            expect(conditions[0]).toEqual({ name: 'priority', oper: '=', value: '1' });
        });

        it('should return this for chaining', () => {
            const result = condition.addCondition('priority', '=', '1');
            expect(result).toBe(condition);
        });

        it('should allow multiple conditions', () => {
            condition
                .addCondition('priority', '=', '1')
                .addCondition('active', '=', 'true');
            expect(condition.getConditions().length).toBe(2);
        });

        it('should handle optional parameters', () => {
            condition.addCondition('field');
            const conditions = condition.getConditions();
            expect(conditions[0].name).toBe('field');
            expect(conditions[0].oper).toBeUndefined();
            expect(conditions[0].value).toBeUndefined();
        });
    });

    describe('addOrCondition', () => {
        it('should add an OR condition', () => {
            condition.addOrCondition('category', '=', 'hardware');
            const conditions = condition.getConditions();
            expect(conditions.length).toBe(1);
            expect(conditions[0]).toEqual({ name: 'category', oper: '=', value: 'hardware' });
        });

        it('should return this for chaining', () => {
            const result = condition.addOrCondition('category', '=', 'hardware');
            expect(result).toBe(condition);
        });

        it('should chain with addCondition', () => {
            condition
                .addCondition('priority', '=', '1')
                .addOrCondition('priority', '=', '2');
            expect(condition.getConditions().length).toBe(2);
        });
    });

    describe('getConditions', () => {
        it('should return empty array initially', () => {
            expect(condition.getConditions()).toEqual([]);
        });
    });
});
