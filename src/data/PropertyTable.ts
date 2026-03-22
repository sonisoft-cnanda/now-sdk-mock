export class PropertyTable{
    private _properties: Record<string, any>;

    public constructor(){
        this._properties = {};
    }

    public getProperty(propertyName: string): any {
        return this._properties[propertyName];
    }

    public setProperty(propertyName: string, value: string): void {
        this._properties[propertyName] = value;
    }
}
