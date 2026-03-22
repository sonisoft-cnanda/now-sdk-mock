import { MockRESTMessageV2 } from "../../@servicenow/glide/sn_ws/MockRESTMessageV2";
import { MockRESTResponseV2 } from "../../@servicenow/glide/sn_ws/MockRESTResponseV2";
import { RESTMessageTemplate } from "./RESTMessageTemplate";


export class RESTDataStore {
    private static _instance: RESTDataStore;
  
    private _mockRequests: MockRESTMessageV2[];
    private _mockResponses: MockRESTResponseV2[];
    private _mockResponseBody: string;
    public get mockResponseBody(): string {
      return this._mockResponseBody;
    }
    public set mockResponseBody(value: string) {
      this._mockResponseBody = value;
    }
    private _mockResponseCode: number;
    public get mockResponseCode(): number {
      return this._mockResponseCode;
    }
    public set mockResponseCode(value: number) {
      this._mockResponseCode = value;
    }
  
    private _restMessageTemplates: Record<string, RESTMessageTemplate> = {};
  
    private _hasError: boolean = false;
    public get hasError(): boolean {
      return this._hasError;
    }
    public set hasError(value: boolean) {
      this._hasError = value;
    }
  
    private constructor() {
      this._mockRequests = [];
      this._mockResponses = [];
      this._mockResponseBody = "";
      this._mockResponseCode = 200;
    }
  
    public static getInstance(): RESTDataStore {
      if (!this._instance) {
        this._instance = new RESTDataStore();
      }
      return this._instance;
    }
  
    public addRESTMessageTemplate(template: RESTMessageTemplate) {
      this._restMessageTemplates[template.messageName] = template;
    }
  
    public getRESTMessageTemplate(messageName: string): RESTMessageTemplate {
      return this._restMessageTemplates[messageName];
    }
  
    public addMockRequest(request: MockRESTMessageV2) {
      this._mockRequests.push(request);
    }
  
    public getMockRequests(): MockRESTMessageV2[] {
      return this._mockRequests;
    }
  
    public addMockResponse(response: MockRESTResponseV2) {
      this._mockResponses.push(response);
    }
  
    public getMockResponses(): MockRESTResponseV2[] {
      return this._mockResponses;
    }
  
    public clearMockResponses() {
      this._mockResponses = [];
    }
  
    public clearMockRequests() {
      this._mockRequests = [];
    }
  
    public clearRestMessageTemplates() {
      this._restMessageTemplates = {};
    }
  
    public clearMockData() {
      this.clearMockRequests();
      this.clearMockResponses();
      this.clearRestMessageTemplates();
    }
  }