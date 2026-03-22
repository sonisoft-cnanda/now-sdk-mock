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

    getDisplayValue(): string {
        return this._value.toString();
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
        return this._value.toString();
    }

    getRefTable(): string {
        return 'some_table'; // Adjust as needed
    }

    getRefField(): string {
        return 'some_field'; // Adjust as needed
    }

    getRefRecordSysId(): string {
        return 'some_sys_id'; // Adjust as needed
    }

    getRefRecordDisplayValue(): string {
        return this._value.toString();
    }

    getRefRecordValue(): any {
        return this._value;
    }

    getRefRecordDisplayValues(): string[] {
        return [this._value.toString()];
    }

    getRefRecordValues(): any[] {
        return [this._value];
    }

    getRefRecordVariables(): Record<string, any> {
        return {};
    }
}