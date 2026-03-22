import { BusinessRuleRunWhen } from "../../data/BusinessRuleRunWhen";
import { Database } from "../../data/Database";
import { InMemoryDataTable } from "../../data/InMemoryDataTable";
import { MockGlideElement } from "./MockGlideElement";
import { MockGlideQueryCondition } from "./MockGlideQueryCondition";
import { GlideRecordDBInit } from "../../common/GlideRecordDBInit";
import { SNTestEnvironment } from "../../common/SNTestEnvironment";
import * as ts from "typescript";
import { log, debug } from 'console';



export class MockGlideRecord {
    public _database: Database = Database.getInstance();
    private _snTestEnvironment: SNTestEnvironment = SNTestEnvironment.getInstance();
    private tableProperties: Map<string, ts.TypeElement> = new Map();

    private _mockNew: any = {};
    public get mockNew(): any {
        return this._mockNew;
    }
    public set mockNew(value: any) {
        this._mockNew = value;
    }

    private _tableName: string;
    private _mockQuery: unknown[];
    public get mockQuery(): unknown[] {
        return this._mockQuery;
    }
    public set mockQuery(value: unknown[]) {
        this._mockQuery = value;
    }
    private _mockCallCount: number;
    private _mockRecordCount: number;
    private _mockCurrent: Record<string, any>;
    public get mockCurrent(): Record<string, any> {
        return this._mockCurrent;
    }
    public set mockCurrent(value: Record<string, any>) {
        this._mockCurrent = value;
        if (this._mockCurrent) {
            this.initProperties();
        }
    }
    private _mockIndex: number;
    public get mockIndex(): number {
        return this._mockIndex;
    }
    public set mockIndex(value: number) {
        this._mockIndex = value;
    }
    private _mockLimit: number = 0;
    public get mockLimit(): number {
        return this._mockLimit;
    }
    public set mockLimit(value: number) {
        this._mockLimit = value;
    }

    private _operation: string;

    private _data: any[];
    public get data(): any[] {
        if (this._data === undefined || this._data === null) {
            this._data = [];
        }
        return this._data;
    }
    public set data(value: any[]) {
        this._data = value;
    }

    private _isNewRecord: boolean = false;
    public set newRecord(value: boolean) {
        this._isNewRecord = value;
    }

    private _conditions: MockGlideQueryCondition[] = [];
    public get conditions(): MockGlideQueryCondition[] {
        return this._conditions;
    }
    public set conditions(value: MockGlideQueryCondition[]) {
        this._conditions = value;
    }

    generateGUID() {
        let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return guid;
    }

    public constructor(tableName: string) {
        this._tableName = tableName;
        this._mockCallCount = 0;
        this._mockRecordCount = 1;
        this._mockQuery = [];
        this._mockCurrent = {};
        this._mockIndex = -1;
        this._data = [];
        this._mockNew = {};
        this.initialize();
    }

    initialize() {
        this._isNewRecord = true;
        this.mockCurrent = this._mockNew;
        this._mockNew.sys_id = this.generateGUID();

        let modulePath = this._snTestEnvironment.modulePath;
        let dbInit = new GlideRecordDBInit(this._tableName, modulePath);
        dbInit.getTableInterfaceFromModule();
        if(dbInit.tableProperties) {
            this.tableProperties = dbInit.tableProperties;
        }
        this.tableProperties.forEach((property, name) => {
            //console.log(`  - ${name}: ${typeChecker.typeToString(typeChecker.getTypeAtLocation(property))}`);
           
            this.defineProperty(name);
        });
    }

    initProperties() {
        var elements = Object.getOwnPropertyNames(this._mockCurrent);
        for (var i = 0; i < elements.length; i++) {
            var strElemName = elements[i];
            this.defineProperty(strElemName);
        }
    }

    defineProperty(prop) {
        if (MockGlideRecord.prototype.hasOwnProperty(prop)) return;

        Object.defineProperty(this, prop, {
            get: () => {
                    return this.getValue(prop);
            },
            set: (value) => {
                this.setValue(prop, value);
            },
            enumerable: true,
            configurable: true
        });
    }

    isElementReferenceType(propName) {
        var isRef = Object.getPrototypeOf(this._mockCurrent[propName]) == MockGlideElement.prototype ? true : false;
        return isRef;
    }

    initQueryGr() {
        this._mockCurrent = {};
        this._isNewRecord = false;
        this.mockIndex = -1;
        let dbTable: InMemoryDataTable = this._database.getTable(this._tableName);
        if (dbTable) {
            this.data = dbTable.getRows();
            if (this.mockLimit) {
                this.data = this.data.slice(0, this.mockLimit);
            }
        }
    }

    public operation() {
        return this._operation;
    }

    public next() {
        this._mockIndex++;
        if (this._mockIndex >= this.data.length) {
            return false;
        }
        this.mockCurrent = this.data[this._mockIndex];
        return true;
    }

    public get(sysId: string) {
        this.initQueryGr();
        this._isNewRecord = false;
        this.mockCurrent = this.data.find((record) => record.sys_id === sysId);
        if (this._mockCurrent) {
            this.mockIndex = this.data.indexOf(this.mockCurrent);
        }
        return this.mockCurrent;
    }

    public isNewRecord() {
        return this._isNewRecord;
    }

    public addEncodedQuery(query: string) {
        this._isNewRecord = false;
        this._mockQuery.push(query);
    }

    public addActiveQuery(...args: any[]) {
        this._isNewRecord = false;
        let q: string = "active=true";
        this._mockQuery.push(q);
    }

    public addNotNullQuery(name: string) {
        this._isNewRecord = false;
        let q: string = `${name}!=NULL`;
        this._mockQuery.push(q);
    }

    public addNullQuery(fieldName: string) {
        this._isNewRecord = false;
        const condition = new MockGlideQueryCondition();
        condition.addCondition(fieldName, 'NULL', null);
        this._conditions.push(condition);
        return condition;
    }

    public addQuery(name?: string, oper?: string, value?: any) {
        this._isNewRecord = false;
        const condition = new MockGlideQueryCondition();
        condition.addCondition(name, oper, value);
        this._conditions.push(condition);
        return condition;
    }

    public query() {
        this.initQueryGr();
    }

    public deleteMultiple() {
        return this;
    }

    public insert() {
        if (this._mockNew) {
            let dbTable: InMemoryDataTable = this._database.addTable(this._tableName);
            if (dbTable) {
                this.getBusinessRules(BusinessRuleRunWhen.BEFORE).forEach((br) => {
                    if (br.type.insert) {
                        br.method.call(this, this);
                    }
                });

                this._operation = "insert";
                let id = this._mockNew.sys_id;
                dbTable.addRow(this._mockNew);
                this._mockNew = null;
                this.get(id);

                this.getBusinessRules(BusinessRuleRunWhen.AFTER).forEach((br) => {
                    if (br.type.insert) {
                        br.method.call(this, this);
                    }
                });
                return this.mockCurrent.sys_id;
            }
        }
        return null;
    }

    private getBusinessRules(when:BusinessRuleRunWhen) {
        let dbTable: InMemoryDataTable = this._database.getTable(this._tableName);
        if (dbTable) {
            return dbTable.businessRules.filter((br) => br.when == when);
        }
        return [];
    }


    public update() {
        const record = this.mockCurrent;
        if (record) {
            record._mockUpdated = true;
        }
        this._operation = "update";
        return record.sys_id || 'mockSysId';
    }

    public setLimit(limit: number) {
        this.mockLimit = limit;
    }

    public setValue(column: string, value: string) {
        this.mockCurrent[column] = new MockGlideElement(value);
        if(this._mockNew)
            this._mockNew[column] = new MockGlideElement(value);
        //this[column] = new MockGlideElement(value);
    }

    public getValue(column: string) {
        //if (this.mockCurrent[column] instanceof MockGlideElement) {
          
            return this.mockCurrent[column].getValue();
        //}
       
        //return this.mockCurrent[column] ?? null;
    }

    public getElement(column: string) {
        let mockElement: MockGlideElement;
        if (this.mockCurrent[column]) {
            if (this.mockCurrent[column] instanceof MockGlideElement) {
                mockElement = this.mockCurrent[column];
            } else {
                mockElement = new MockGlideElement(this.mockCurrent[column]);
                mockElement.setRefRecord(this.mockCurrent[column]);
            }
            return mockElement;
        }
        return null;
    }

    public getUniqueValue() {
        return this.getValue('sys_id');
    }

    public isValidField() {
        return true;
    }

    public isValidRecord() {
        return true;
    }

    public isValid() {
        return true;
    }

    public getTableName() {
        return this._tableName;
    }

    public getRecordClassName() {
        return this._tableName;
    }

    public getRowCount() {
        return this.data.length;
    }

    public hasNext() {
        return this.mockIndex < this._data.length - 1;
    }

    public addRecord(record: any) {
        this.data.push(record);
    }

    public reset() {
        this.mockIndex = -1;
    }

    public setMockData(data: any[]) {
        this.data = data;
    }

    public getMockData() {
        return this._data;
    }
}