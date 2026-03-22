import { GlideRecord } from "@servicenow/glide";

export class EventQueue{
    private static _instance:EventQueue;

    public static getInstance():EventQueue{
        if(!EventQueue._instance){
            EventQueue._instance = new EventQueue();
        }
        return EventQueue._instance;
    }

    private _queue:[];

    
    public eventQueue(eventName:string, instance:GlideRecord, parm1:string, parm2:string, queue:string) : void{

    }

}