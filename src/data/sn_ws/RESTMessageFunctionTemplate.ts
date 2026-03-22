export class RESTMessageFunctionTemplate {
    private _methodName: string;
    public get methodName(): string {
      return this._methodName;
    }
    public set methodName(value: string) {
      this._methodName = value;
    }
  
    private _templateBody: string;
    public get templateBody(): string {
      return this._templateBody;
    }
    public set templateBody(value: string) {
      this._templateBody = value;
    }
  
    private _defaultEndpoint: string = "";
  
    public constructor(methodName: string, templateBody: string) {
      this._methodName = methodName;
      this._templateBody = templateBody;
    }
  
    public setDefaultEndpoint(endpoint: string) {
      this._defaultEndpoint = endpoint;
    }
  
    public getDefaultEndpoint() {
      return this._defaultEndpoint;
    }
  }