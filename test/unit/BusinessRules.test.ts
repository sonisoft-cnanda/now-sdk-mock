import { DataTableBusinessRule } from '../../src/data/DataTableBusinessRule';
import { BusinessRuleRunWhen } from '../../src/data/BusinessRuleRunWhen';
import { BusinessRuleRunType } from '../../src/data/BusinessRuleRunType';

describe('BusinessRuleRunWhen', () => {
    it('should have BEFORE = 10', () => {
        expect(BusinessRuleRunWhen.BEFORE).toBe(10);
    });

    it('should have AFTER = 20', () => {
        expect(BusinessRuleRunWhen.AFTER).toBe(20);
    });

    it('should have ASYNC = 30', () => {
        expect(BusinessRuleRunWhen.ASYNC).toBe(30);
    });
});

describe('BusinessRuleRunType', () => {
    it('should have insert, update, delete, query properties', () => {
        const brType = new BusinessRuleRunType();
        brType.insert = true;
        brType.update = false;
        brType.delete = true;
        brType.query = false;

        expect(brType.insert).toBe(true);
        expect(brType.update).toBe(false);
        expect(brType.delete).toBe(true);
        expect(brType.query).toBe(false);
    });
});

describe('DataTableBusinessRule', () => {
    it('should store name, when, type, and method', () => {
        const brType = new BusinessRuleRunType();
        brType.insert = true;
        brType.update = false;
        brType.delete = false;
        brType.query = false;

        const fn = jest.fn();
        const rule = new DataTableBusinessRule('My Rule', BusinessRuleRunWhen.BEFORE, brType, fn);

        expect(rule.name).toBe('My Rule');
        expect(rule.when).toBe(BusinessRuleRunWhen.BEFORE);
        expect(rule.type).toBe(brType);
        expect(rule.method).toBe(fn);
    });

    it('should allow updating properties via setters', () => {
        const brType = new BusinessRuleRunType();
        brType.insert = true;
        const fn1 = jest.fn();
        const fn2 = jest.fn();

        const rule = new DataTableBusinessRule('Rule 1', BusinessRuleRunWhen.BEFORE, brType, fn1);

        rule.name = 'Rule 2';
        rule.when = BusinessRuleRunWhen.AFTER;
        rule.method = fn2;

        expect(rule.name).toBe('Rule 2');
        expect(rule.when).toBe(BusinessRuleRunWhen.AFTER);
        expect(rule.method).toBe(fn2);
    });

    it('should execute the method when called', () => {
        const brType = new BusinessRuleRunType();
        brType.insert = true;

        const fn = jest.fn((current) => {
            current.priority = '1';
        });

        const rule = new DataTableBusinessRule('Set Priority', BusinessRuleRunWhen.BEFORE, brType, fn);

        const mockCurrent = { priority: '3' };
        rule.method(mockCurrent);

        expect(fn).toHaveBeenCalledWith(mockCurrent);
        expect(mockCurrent.priority).toBe('1');
    });
});
