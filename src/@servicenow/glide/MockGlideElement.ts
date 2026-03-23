import { GlideRecord } from "@servicenow/glide";
import { MockGlideRecord } from "./MockGlideRecord";

export class MockGlideElement {
    private _value: any;
    private _refRecordTableName:string = "";
    private _refRecord:MockGlideRecord;

    constructor(value: any) {
        this._value = value;
    }

    setRefRecordTableName(tableName: string): void {
        this._refRecordTableName = tableName;
    }

    getValue(): any {
        return this._value;
    }

    setValue(value: any): void {
        this._value = value;
    }

    toString(): string {
        if (this._value === null || this._value === undefined) {
            return '';
        }
        return String(this._value);
    }

    [Symbol.toPrimitive](hint: string): string | number {
        if (hint === 'number') {
            return Number(this._value);
        }
        return this.toString();
    }

    getDisplayValue(): string {
        return this.toString();
    }

    getRefRecord(): MockGlideRecord {
        return this._refRecord;
    }

    setRefRecord(record: GlideRecord): void {
        this._refRecord = record as unknown as MockGlideRecord;
        this._refRecordTableName = record.getTableName();
    }

    nil(): boolean {
        return this._value === null || this._value === undefined;
    }

    changes(): boolean {
        // Implement logic to check if the value has changed
        return false;
    }

    changesFrom(value: any): boolean {
        // Implement logic to check if the value has changed from the given value
        return false;
    }

    changesTo(value: any): boolean {
        // Implement logic to check if the value has changed to the given value
        return false;
    }

    getBooleanValue(): boolean {
        return Boolean(this._value);
    }

    getHTMLValue(): string {
        return this.toString();
    }

    getRefTable(): string {
        return this._refRecordTableName || '';
    }

    getRefField(): string {
        return 'some_field'; // Adjust as needed
    }

    getRefRecordSysId(): string {
        return 'some_sys_id'; // Adjust as needed
    }

    getRefRecordDisplayValue(): string {
        return this.toString();
    }

    getRefRecordValue(): any {
        return this._value;
    }

    getRefRecordDisplayValues(): string[] {
        return [this.toString()];
    }

    getRefRecordValues(): any[] {
        return [this._value];
    }

    getRefRecordVariables(): Record<string, any> {
        return {};
    }
}