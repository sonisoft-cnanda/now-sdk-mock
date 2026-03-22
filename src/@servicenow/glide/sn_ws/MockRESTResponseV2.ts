import { RESTDataStore } from "../../../data/sn_ws/RESTDataStore";
import { MockRESTMessageV2 } from "./MockRESTMessageV2";

export class MockRESTResponseV2 {
    private _mock_request: MockRESTMessageV2;
    private _headers: Record<string, string> = {};
  
    constructor(request: MockRESTMessageV2) {
      RESTDataStore.getInstance().addMockResponse(this);
      this._mock_request = request;
    }
  
    public getBody(): any {
      return RESTDataStore.getInstance().mockResponseBody;
    }
  
    public getStatusCode(): number {
      return RESTDataStore.getInstance().mockResponseCode;
    }
  
    public getRequest(): MockRESTMessageV2 {
      return this._mock_request;
    }
  
    public getHeaders(): Record<any, any> {
      return this._headers;
    }
  
    public getHeader(headerName: string): string {
      return this._headers[headerName];
    }
  
    public haveError(): boolean {
      return RESTDataStore.getInstance().hasError;
    }
  }