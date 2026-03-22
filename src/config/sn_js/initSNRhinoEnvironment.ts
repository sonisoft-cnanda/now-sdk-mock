
const { MockGlideRecord, MockGlideSystem, MockGlideElement, MockGlideDateTime, MockGlideQueryCondition, MockGlideAggregate, GlideDate, GlideTime, MockAbstractAjaxProcessor} = require('../../index.js');
const Class = require('./PrototypeServer.js');


export function initSnRhinoEnvironment(){

    global.Class =Class;

    global.GlideRecord = MockGlideRecord;
    global.GlideElement = MockGlideElement;
    global.GlideDateTime = MockGlideDateTime;
    global.GlideQueryCondition = MockGlideQueryCondition;
    global.GlideAggregate = MockGlideAggregate;
    global.GlideDate = GlideDate;
    global.GlideTime = GlideTime;
    global.AbstractAjaxProcessor = MockAbstractAjaxProcessor;

    global.GlideSystem = jest.fn().mockImplementation(() => {
        let mockGs = jest.requireActual('sn-sdk-mock').mockGs;
        return mockGs;
    });
    global.gs = new MockGlideSystem()

}