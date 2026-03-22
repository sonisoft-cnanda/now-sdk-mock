export class MockAbstractAjaxProcessor {
    private CALLABLE_PREFIX: string;
    private request: any;
    private responseXML: any;
    private gc: any;

    constructor(request?: any, responseXML?: any, gc?: any) {
        this.CALLABLE_PREFIX = "";
        this.request = request;
        this.responseXML = responseXML;
        this.gc = gc;
    }

    public process = jest.fn().mockImplementation(() => {
        return "";
    });

    public newItem = jest.fn().mockImplementation((name: string) => {
        return {};
    });

    public getParameter = jest.fn().mockImplementation((name: string) => {
        return "";
    });

    public getDocument = jest.fn().mockImplementation(() => {
        return {};
    });

    public getRootElement = jest.fn().mockImplementation(() => {
        return {};
    });

    public getName = jest.fn().mockImplementation(() => {
        return "";
    });

    public getValue = jest.fn().mockImplementation(() => {
        return "";
    });

    public getType = jest.fn().mockImplementation(() => {
        return "";
    });

    public getChars = jest.fn().mockImplementation(() => {
        return "";
    });

    public setAnswer = jest.fn().mockImplementation((value: string) => {
        // Do nothing
    });

    public setError = jest.fn().mockImplementation((error: string) => {
        // Do nothing
    });

    type: string = "";
}