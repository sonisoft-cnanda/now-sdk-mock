export class MockGlideTime{

    private _dateInstance: Date;
    public get dateInstance(): Date {
        return this._dateInstance;
    }
    public set dateInstance(value: Date) {
        this._dateInstance = value;
    }

    public constructor(dt:Date){
        this._dateInstance = dt;
    }

    getByFormat =  jest.fn((val:string) => {
        
        switch(val){
            case "yyyy-MM-dd HH:mm:ss":
                return this.dateInstance.toISOString();
            case "yyyy":
                return this._dateInstance.getUTCFullYear().toString();
            case "MM":
                return (this._dateInstance.getUTCMonth() + 1).toString().padStart(2, '0');
            case "dd":
                return this._dateInstance.getUTCDate().toString().padStart(2, '0');
            case "HH":
                return this.dateInstance.getUTCHours().toString().padStart(2, '0');
            case "mm":
                return this.dateInstance.getUTCMinutes().toString().padStart(2, '0');
            case "ss":
                return this.dateInstance.getUTCSeconds().toString().padStart(2, '0');
        }
    })
}