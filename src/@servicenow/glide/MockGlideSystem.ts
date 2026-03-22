import { GlideRecord } from "@servicenow/glide";
import { log, error, debug, warn } from "console";
import { Database } from "../../data/Database";
import { PropertyDB } from "../../data/PropertyDB";
import { InMemoryDataTable } from "../../data/InMemoryDataTable";



export class MockGlideSystem {
    private _data:InMemoryDataTable;
    public get data(): InMemoryDataTable {
        return this._data;
    }


    public constructor() {
        this._data = Database.getInstance().addTable('sys_properties');
    }


    public getProperty(propertyName: string): any {
        return PropertyDB.getInstance().getProperty(propertyName);
    }

    public setProperty(propertyName: string, value: string): void {
        PropertyDB.getInstance().setProperty(propertyName, value);
    }

    public log(message: string): void {
        console.log(message);
    }

    public importXML(xml: string): string {
        return xml;
    }

    public getUserName(): string {
        return 'admin';
    }

    public getSystemId(): string {
        return 'admin';
    }

    public nil(value: unknown): boolean {
        return !value;
    }

    public error(msg: string): void {
        error(msg);
    }

    public warn(msg: string): void {
        warn(msg);
    }

    public debug(msg: string): void {
        debug(msg);
    }

    public info(msg: string): void {
        log(msg);
    }

    public eventQueue(eventName: string, instance: GlideRecord, parm1: string, parm2: string, queue: string | object): void {
        // Implement event queue logic if needed
    }

    public urlEncode(value: string): string {
        return encodeURIComponent(value);
    }

    public include(name: string): string {
        return "";
    }

}

export function newMockGlideSystem() : MockGlideSystem{
    return new MockGlideSystem();
}

export const mockGs = new MockGlideSystem();
export const gs = mockGs;