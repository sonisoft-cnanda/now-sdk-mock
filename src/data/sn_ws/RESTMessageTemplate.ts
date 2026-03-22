import { RESTMessageFunctionTemplate } from "./RESTMessageFunctionTemplate";

export class RESTMessageTemplate {
    private _messageName: string;
    public get messageName(): string {
      return this._messageName;
    }
    public set messageName(value: string) {
      this._messageName = value;
    }
  
    private _methods: Record<string, RESTMessageFunctionTemplate> = {};
    public get methods(): Record<string, RESTMessageFunctionTemplate> {
      return this._methods;
    }
    public set methods(value: Record<string, RESTMessageFunctionTemplate>) {
      this._methods = value;
    }
  
    public constructor(messageName: string) {
      this._messageName = messageName;
    }
  
    public addMethod(methodName: string, templateBody: string) {
      this._methods[methodName] = new RESTMessageFunctionTemplate(
        methodName,
        templateBody
      );
    }
  }