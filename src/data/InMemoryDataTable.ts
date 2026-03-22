import { DataTableBusinessRule } from "./DataTableBusinessRule";

export class InMemoryDataTable{
    private _rows: Record<string, any>[];
    public get rows(): Record<string, any>[] {
        return this._rows;
    }
    public set rows(value: Record<string, any>[]) {
        this._rows = value;
    }
    private _tableName: string;
    public get tableName(): string {
        return this._tableName;
    }
    public set tableName(value: string) {
        this._tableName = value;
    }

    private _businessRules: DataTableBusinessRule[] = [];

    public get businessRules(): DataTableBusinessRule[] {
        return this._businessRules;
    }

    public set businessRules(value: DataTableBusinessRule[]) {
        this._businessRules = value;
    }

    constructor(name: string){
        this._tableName = name;
        this._rows = [];
    }

    public addRow(row:Record<string,any>){
        this._rows.push(row);
    }

    public addRows(rows:Record<string,any>[]){
        this._rows.push(...rows);
    }

    public getRows(){
        return this._rows;
    }

    public setRows(rows:Record<string,any>[]){
        this._rows = rows;
    }


    public getRowBySysId(sysId:string){
        return this._rows.find((row) => row.sys_id === sysId);
    }

    public getRowByField(field:string,value:string){
        return this._rows.find((row) => row[field] === value);
    }

    public deleteRowBySysId(sysId:string){
        this._rows = this._rows.filter((row) => row.sys_id !== sysId);
    }

    public deleteRowByField(field:string,value:string){
        this._rows = this._rows.filter((row) => row[field] !== value);
    }

}