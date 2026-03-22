import { RESTDataStore } from "../../../data/sn_ws/RESTDataStore";
import { log, error, debug, warn } from "console";
import { MockRESTResponseV2 } from "./MockRESTResponseV2";



export class MockRESTMessageV2 {
    private mockProperties: Record<string, string>;
    private mockEccParams: Record<string, string>;
    private mockParams: Record<string, string>;
    
    private _name: string | null = null;
    public get name(): string | null {
      return this._name;
    }
    public set name(value: string | null) {
      this._name = value;
    }
  
    private _methodName: string | null = null;
    public get methodName(): string | null {
      return this._methodName;
    }
    public set methodName(value: string | null) {
      this._methodName = value;
    }
  
    private _endpoint: string;
    public get endpoint(): string {
      return this._endpoint;
    }
    public set endpoint(value: string) {
      this._endpoint = value;
    }
  
    private _restMessageBody: string | null = null;
    private _parameters: any[] = [];
    public get parameters(): any[] {
      return this._parameters;
    }
    public set parameters(value: any[]) {
      this._parameters = value;
    }
  
    private _headers = new Array().fill({
      name: "session",
      value: "${session_id}",
    });
    private _bodyTemplate: string | null = null; 
  
    public get bodyTemplate() {
      return this._bodyTemplate;
    }
    public set bodyTemplate(value) {
      this._bodyTemplate = value;
    }
  
    constructor(name?: string, methodName?: string) {
      RESTDataStore.getInstance().addMockRequest(this);
      this.mockProperties = {};
      this.mockEccParams = {};
      this.mockParams = {};
  
      this._headers = new Array().fill({
        name: "session",
        value: "${session_id}",
      });
      if (name) this.name = name;
      if (methodName) this.methodName = methodName;
  
      if (name && methodName) {
        let restMessage =
        RESTDataStore.getInstance().getRESTMessageTemplate(name);
  
        if (restMessage) {
          debug(
            JSON.stringify(
              "RESTMessage object found in data store." + restMessage
            )
          );
          let restMessageFn = restMessage.methods[methodName];
  
          if (restMessageFn) {
            debug("MOCKRESTMessageV2: " + JSON.stringify(restMessageFn));
  
            this._bodyTemplate = restMessageFn.templateBody;
            this._endpoint = restMessageFn.getDefaultEndpoint();
          } else {
            error(
              "RESTMessageFunctionTemplate not found for " +
                name +
                "." +
                methodName
            );
          }
        } else {
          error("RESTMessageTemplate not found for " + name);
        }
      }
    }
  
    public getRequestHeader(headerName?: string): string {
      if (headerName) {
        let header = this._headers.find((header) => header.name === headerName);
        if (header) return header.value;
      }
      return "";
    }
  
    public getRequestHeaders(): Record<any, any> {
      return this._headers;
    }
  
    public getRequestBody(): string | null {
      return this._restMessageBody;
    }
  
    public setRequestHeader(name: string, value: string): void {
      this._headers.push({ name: name, value: value });
    }
  
    public setStringParameter(name: string, value: string): void {
      this._parameters.push({ name: name, value: value });
    }
  
    // setStringParameterNoEscape =  jest.fn().mockImplementation((name:string, value:string) => {
    //     this._parameters.push({name: name, value: value});
    // });
  
    public setStringParameterNoEscape(name: string, value: string) {
      this._parameters.push({ name: name, value: value });
    }
  
    public getEndpoint(): string {
      return this._endpoint;
    }
  
    public setMIDServer(value: string): void {
      this.mockProperties["mid_server"] = value;
    }
  
    public execute(): MockRESTResponseV2 {
      // Generate a body value based on the deployMutation string
      let body = this._bodyTemplate;
  
      this._parameters.forEach((param) => {
        if (body) body = body.replace("\\${" + param.name + "}", param.value);
  
        this._headers.forEach((header) => {
          header.value = header.value.replace(
            "${" + param.name + "}",
            param.value
          );
        });
        if (this._endpoint)
          this._endpoint = this._endpoint.replace(
            "${" + param.name + "}",
            param.value
          );
      });
      this._restMessageBody = body;
  
      let response = new MockRESTResponseV2(this);
  
      return response;
    }
  
    public executeAsync(): MockRESTResponseV2 {
      let body = this._bodyTemplate;
  
      this._parameters.forEach((param) => {
        if (body) body = body.replace("\\${" + param.name + "}", param.value);
  
        this._headers.forEach((header) => {
          header.value = header.value.replace(
            "${" + param.name + "}",
            param.value
          );
        });
        if (this._endpoint)
          this._endpoint = this._endpoint.replace(
            "${" + param.name + "}",
            param.value
          );
      });
      this._restMessageBody = body;
  
      let response = new MockRESTResponseV2(this);
  
      return response;
    }
  
    public setHttpTimeout(timeout: number): void {
      this.mockProperties["http_timeout"] = timeout.toString();
    }
  
    public setEccParameter(param: string, value: string): void {
      this.mockEccParams[param] = value;
    }
  
    public setHttpMethod(method: string): void {
      this.mockProperties["http_method"] = method;
    }
  
    public setEndpoint(endpoint: string): void {
      this._endpoint = endpoint;
    }
  
    public setRequestBody(body: string): void {
      this._restMessageBody = body;
    }
  
    getMockProperties(): Record<string, string> {
      return this.mockProperties;
    }
  
    getMockEccParams(): Record<string, string> {
      return this.mockEccParams;
    }
  
    getMockParams(): Record<string, string> {
      return this.mockParams;
    }
  
    getMockRequestBody(): string | null {
      return this._restMessageBody;
    }
  }