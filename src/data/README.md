



```
const { MockGlideRecord, MockGlideSystem, Database, DataTableBusinessRule, BRRunWhen, BusinessRuleRunType, initSNRhinoEnvironment, BusinessRuleRunWhen } = require('sn-sdk-mock');
const { expect, it, describe, beforeEach } = require('@jest/globals');

initSNRhinoEnvironment();


describe("IncidentUtil", () => {
    let tblIncident;

    beforeEach(() => {
        Database.reInitialize();

         tblIncident = Database.getInstance().addTable('incident');
        
         
        
        let querySpy = jest.spyOn(MockGlideRecord.prototype, 'query');

        jest.spyOn(MockGlideRecord.prototype, 'query').mockImplementation((val) => {
            const hash = crypto.createHash('md5').update(val).digest('base64');
            return hash;
        });

        expect(querySpy).toHaveBeenCalled();
       
        
    
    });
});


```