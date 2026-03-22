import { GlideDateTime } from "@servicenow/glide";
import { MockGlideDate } from "./MockGlideDate";
import { MockGlideTime } from "./MockGlideTime";
import { parseISO } from "date-fns/parseISO";
import { DBUtil } from "../../common/DBUtil";

export class MockGlideDateTime{

    private _dateInstance: Date;
    public get dateInstance(): Date {
        return this._dateInstance;
    }
    public set dateInstance(value: Date) {
        this._dateInstance = value;
    }

    public constructor(dt?:string | number | null){

        if(dt == undefined || !dt){
            this._dateInstance = new Date(Date.now());
        }else{
            DBUtil.tryParseInt(dt?.toString(), (isParsed:boolean, value:number | undefined) => {
                if(isParsed != undefined && isParsed){
                    this._dateInstance = new Date();
                    this._dateInstance.setUTCMilliseconds(value as unknown as number);
                }else{
                    this._dateInstance = (dt == undefined || !dt) ? new Date(Date.now()) : parseISO(dt.toString());
                }
            });
    
        }

    }

    getTime = jest.fn().mockImplementation(() => {
        return new MockGlideTime(this.dateInstance);
    });
    getDate = jest.fn().mockImplementation(() => {
        return new MockGlideDate(this.dateInstance);
    });
    getNumericValue= jest.fn().mockImplementation(() => {
        return this.dateInstance.getTime();
    } )
    getYearLocalTime= jest.fn(() => this.dateInstance.getFullYear())
    getMonthLocalTime= jest.fn(() => this.dateInstance.getMonth() + 1)
    getDayOfMonthLocalTime= jest.fn(() => this.dateInstance.getDate())
    getYearUTC= jest.fn(() => this.dateInstance.getUTCFullYear())
    getMonthUTC= jest.fn(() => this.dateInstance.getUTCMonth() + 1)
    getDayOfMonthUTC= jest.fn(() => this.dateInstance.getUTCDate())
    addDays= jest.fn()
    addSeconds= jest.fn((val:number) => {
        this.dateInstance.setSeconds(this.dateInstance.getSeconds() + val);
    })
    add= jest.fn((val:number) => {
        this.dateInstance.setTime(this.dateInstance.getTime() + val);
    })
    toString =  jest.fn(() => {
        // const zonedDate = toZonedTime(_dt, 'UTC');
        
        // const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.000'Z'");
        
        // return formattedDate; 
        //toString in ServiceNow does not return the ISO String
        return this.dateInstance.toISOString();
        
    })
} 


export function newMockGlideDateTime(dt?:string | number | null):GlideDateTime{
    const originalModule = jest.requireActual("@servicenow/glide");

    const instance:MockGlideDateTime = new MockGlideDateTime(dt);
    const OriginalGlideDateTime = originalModule.GlideDateTime;
    const _originalInstance = new OriginalGlideDateTime(dt);
    return Object.assign(Object.create(_originalInstance), instance);
    // return new GlideDateTime(dt);
}
