export class MockGlideQueryCondition {
    private conditions: { name?: string; oper?: string; value?: any }[] = [];

    addCondition(name?: string, oper?: string, value?: any): MockGlideQueryCondition {
        this.conditions.push({ name, oper, value });
        return this;
    }

    addOrCondition(name?: string, oper?: string, value?: any): MockGlideQueryCondition {
        this.conditions.push({ name, oper, value });
        return this;
    }

    getConditions(): { name?: string; oper?: string; value?: any }[] {
        return this.conditions;
    }
}