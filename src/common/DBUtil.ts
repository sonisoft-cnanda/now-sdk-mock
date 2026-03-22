import { gs } from "@servicenow/glide";


export class DBUtil {

    public static tryParseInt(value: string, out: (isParsed:boolean, value?: number) => void): void {
       let parseSuccessful:boolean = false;
       let val:number | null = null;
        try {
            val = !isNaN(Number(value)) ? parseInt(value) : null;
            if(val != null){
                parseSuccessful = true;
                //out(true, val);
            }
        } catch (error) {
            val = null;
            parseSuccessful = false;
            gs.error("Error parsing value: " + value);
        }
        out(parseSuccessful, val);
    }
}