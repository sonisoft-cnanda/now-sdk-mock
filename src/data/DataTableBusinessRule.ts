import { BusinessRuleRunType } from "./BusinessRuleRunType";
import { BusinessRuleRunWhen } from "./BusinessRuleRunWhen";

export class DataTableBusinessRule{
    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    private _brMethod: Function;
    public get method(): Function {
        return this._brMethod;
    }
    public set method(value: Function) {
        this._brMethod = value;
    }

    private _when:number;

    public get when(): number {
        return this._when;
    }

    public set when(value: number) {
        this._when = value;
    }

    private _brType:BusinessRuleRunType;
    public get type(): BusinessRuleRunType {
        return this._brType;
    }
    public set type(value: BusinessRuleRunType) {
        this._brType = value;
    }

    constructor(name:string, brWhen:BusinessRuleRunWhen, type:BusinessRuleRunType, method:Function){
        this._name = name;
        this.method = method;
        this._when = brWhen;
        this._brType = type;
    }    
}