import { GlideRecord } from "@servicenow/glide";
import { MockGlideRecord } from "../@servicenow/glide/MockGlideRecord";
import { MockGlideElement } from "../@servicenow/glide/MockGlideElement";

export class GlideElementUtil {

    public static createGlideElementReference(elementName:string, refTable:string, refObject) : MockGlideElement{
        const gr = new MockGlideRecord(refTable);
        gr.setMockData(refObject);
        
        const ge = new MockGlideElement(elementName);

        ge.setRefRecord(gr as unknown as GlideRecord);
        ge.setRefRecordTableName(refTable);

        return ge;

    }

    public static createGlideElementReferenceForGlideRecord(elementName:string, record:MockGlideRecord) : MockGlideElement{
        const ge = new MockGlideElement(elementName);
        ge.setRefRecord(record as unknown as GlideRecord);
        ge.setRefRecordTableName(record.getTableName());

        return ge;

    }
}