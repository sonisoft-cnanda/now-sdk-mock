import { MockGlideRecord } from "./MockGlideRecord";

export class MockGlideAggregate extends MockGlideRecord{

    private _groupBy:string = null;
    public get groupByVal():string{
        return this._groupBy;
    }
    public set groupByVal(value:string){
        this._groupBy = value;
    }

    groupBy = jest.fn().mockImplementation((column: string) => {
        this.groupByVal = column;
        return this;
    });
}