import { MockRESTMessageV2 } from '../../src/@servicenow/glide/sn_ws/MockRESTMessageV2';
import { MockRESTResponseV2 } from '../../src/@servicenow/glide/sn_ws/MockRESTResponseV2';
import { RESTDataStore } from '../../src/data/sn_ws/RESTDataStore';
import { RESTMessageTemplate } from '../../src/data/sn_ws/RESTMessageTemplate';
import { RESTMessageFunctionTemplate } from '../../src/data/sn_ws/RESTMessageFunctionTemplate';

describe('RESTDataStore', () => {
    beforeEach(() => {
        RESTDataStore.getInstance().clearMockData();
    });

    it('should be a singleton', () => {
        const store1 = RESTDataStore.getInstance();
        const store2 = RESTDataStore.getInstance();
        expect(store1).toBe(store2);
    });

    it('should default to 200 response code', () => {
        expect(RESTDataStore.getInstance().mockResponseCode).toBe(200);
    });

    it('should default to empty response body', () => {
        expect(RESTDataStore.getInstance().mockResponseBody).toBe('');
    });

    it('should default hasError to false', () => {
        expect(RESTDataStore.getInstance().hasError).toBe(false);
    });

    describe('mock response configuration', () => {
        it('should set and get response body', () => {
            RESTDataStore.getInstance().mockResponseBody = '{"result": "ok"}';
            expect(RESTDataStore.getInstance().mockResponseBody).toBe('{"result": "ok"}');
        });

        it('should set and get response code', () => {
            RESTDataStore.getInstance().mockResponseCode = 404;
            expect(RESTDataStore.getInstance().mockResponseCode).toBe(404);
        });

        it('should set and get hasError', () => {
            RESTDataStore.getInstance().hasError = true;
            expect(RESTDataStore.getInstance().hasError).toBe(true);
        });
    });

    describe('request tracking', () => {
        it('should track mock requests', () => {
            const rm = new MockRESTMessageV2();
            const requests = RESTDataStore.getInstance().getMockRequests();
            expect(requests.length).toBeGreaterThanOrEqual(1);
        });

        it('should clear mock requests', () => {
            new MockRESTMessageV2();
            RESTDataStore.getInstance().clearMockRequests();
            expect(RESTDataStore.getInstance().getMockRequests().length).toBe(0);
        });
    });

    describe('response tracking', () => {
        it('should clear mock responses', () => {
            RESTDataStore.getInstance().clearMockResponses();
            expect(RESTDataStore.getInstance().getMockResponses().length).toBe(0);
        });
    });

    describe('REST message templates', () => {
        it('should add and retrieve a template', () => {
            const template = new RESTMessageTemplate('MyRESTMessage');
            RESTDataStore.getInstance().addRESTMessageTemplate(template);

            const retrieved = RESTDataStore.getInstance().getRESTMessageTemplate('MyRESTMessage');
            expect(retrieved).toBe(template);
        });

        it('should clear templates', () => {
            const template = new RESTMessageTemplate('MyRESTMessage');
            RESTDataStore.getInstance().addRESTMessageTemplate(template);
            RESTDataStore.getInstance().clearRestMessageTemplates();

            expect(RESTDataStore.getInstance().getRESTMessageTemplate('MyRESTMessage')).toBeUndefined();
        });
    });

    describe('clearMockData', () => {
        it('should clear everything', () => {
            new MockRESTMessageV2();
            RESTDataStore.getInstance().addRESTMessageTemplate(new RESTMessageTemplate('test'));
            RESTDataStore.getInstance().clearMockData();

            expect(RESTDataStore.getInstance().getMockRequests().length).toBe(0);
            expect(RESTDataStore.getInstance().getMockResponses().length).toBe(0);
            expect(RESTDataStore.getInstance().getRESTMessageTemplate('test')).toBeUndefined();
        });
    });
});

describe('RESTMessageTemplate', () => {
    it('should store message name', () => {
        const template = new RESTMessageTemplate('MyMessage');
        expect(template.messageName).toBe('MyMessage');
    });

    it('should add methods', () => {
        const template = new RESTMessageTemplate('MyMessage');
        template.addMethod('getData', '{"query": "${query_param}"}');

        expect(template.methods['getData']).toBeDefined();
        expect(template.methods['getData'].methodName).toBe('getData');
        expect(template.methods['getData'].templateBody).toBe('{"query": "${query_param}"}');
    });
});

describe('RESTMessageFunctionTemplate', () => {
    it('should store method name and template body', () => {
        const fn = new RESTMessageFunctionTemplate('postData', '{"key": "${value}"}');
        expect(fn.methodName).toBe('postData');
        expect(fn.templateBody).toBe('{"key": "${value}"}');
    });

    it('should set and get default endpoint', () => {
        const fn = new RESTMessageFunctionTemplate('postData', '{}');
        fn.setDefaultEndpoint('https://api.example.com/v1');
        expect(fn.getDefaultEndpoint()).toBe('https://api.example.com/v1');
    });

    it('should default endpoint to empty string', () => {
        const fn = new RESTMessageFunctionTemplate('postData', '{}');
        expect(fn.getDefaultEndpoint()).toBe('');
    });
});

describe('MockRESTMessageV2', () => {
    beforeEach(() => {
        RESTDataStore.getInstance().clearMockData();
    });

    describe('basic operations', () => {
        it('should set and get endpoint', () => {
            const rm = new MockRESTMessageV2();
            rm.setEndpoint('https://api.example.com');
            expect(rm.getEndpoint()).toBe('https://api.example.com');
        });

        it('should set HTTP method', () => {
            const rm = new MockRESTMessageV2();
            rm.setHttpMethod('POST');
            expect(rm.getMockProperties()['http_method']).toBe('POST');
        });

        it('should set and get request body', () => {
            const rm = new MockRESTMessageV2();
            rm.setRequestBody('{"key": "value"}');
            expect(rm.getRequestBody()).toBe('{"key": "value"}');
        });

        it('should set and get request headers', () => {
            const rm = new MockRESTMessageV2();
            rm.setRequestHeader('Content-Type', 'application/json');
            expect(rm.getRequestHeader('Content-Type')).toBe('application/json');
        });

        it('should return empty string for non-existent header', () => {
            const rm = new MockRESTMessageV2();
            expect(rm.getRequestHeader('X-Missing')).toBe('');
        });

        it('should set HTTP timeout', () => {
            const rm = new MockRESTMessageV2();
            rm.setHttpTimeout(30000);
            expect(rm.getMockProperties()['http_timeout']).toBe('30000');
        });

        it('should set MID server', () => {
            const rm = new MockRESTMessageV2();
            rm.setMIDServer('my-mid');
            expect(rm.getMockProperties()['mid_server']).toBe('my-mid');
        });

        it('should set ECC parameters', () => {
            const rm = new MockRESTMessageV2();
            rm.setEccParameter('skip_sensor', 'true');
            expect(rm.getMockEccParams()['skip_sensor']).toBe('true');
        });
    });

    describe('string parameters', () => {
        it('should add string parameters', () => {
            const rm = new MockRESTMessageV2();
            rm.setStringParameter('key', 'value');
            expect(rm.parameters.length).toBe(1);
            expect(rm.parameters[0]).toEqual({ name: 'key', value: 'value' });
        });

        it('should add string parameters with no escape', () => {
            const rm = new MockRESTMessageV2();
            rm.setStringParameterNoEscape('key', '<html>value</html>');
            expect(rm.parameters.length).toBe(1);
        });
    });

    describe('execute', () => {
        it('should return a MockRESTResponseV2', () => {
            RESTDataStore.getInstance().mockResponseBody = '{"status": "success"}';
            RESTDataStore.getInstance().mockResponseCode = 200;

            const rm = new MockRESTMessageV2();
            rm.setEndpoint('https://api.example.com');
            const response = rm.execute();

            expect(response).toBeInstanceOf(MockRESTResponseV2);
            expect(response.getBody()).toBe('{"status": "success"}');
            expect(response.getStatusCode()).toBe(200);
        });

        it('should substitute parameters in endpoint', () => {
            const rm = new MockRESTMessageV2();
            rm.setEndpoint('https://api.example.com/${version}/data');
            rm.setStringParameter('version', 'v2');
            rm.execute();

            expect(rm.getEndpoint()).toBe('https://api.example.com/v2/data');
        });

        it('should substitute parameters in headers', () => {
            const rm = new MockRESTMessageV2();
            rm.setRequestHeader('Authorization', 'Bearer ${token}');
            rm.setStringParameter('token', 'abc123');
            rm.execute();

            expect(rm.getRequestHeader('Authorization')).toBe('Bearer abc123');
        });
    });

    describe('executeAsync', () => {
        it('should return a MockRESTResponseV2', () => {
            RESTDataStore.getInstance().mockResponseBody = '{"async": true}';
            RESTDataStore.getInstance().mockResponseCode = 202;

            const rm = new MockRESTMessageV2();
            const response = rm.executeAsync();

            expect(response).toBeInstanceOf(MockRESTResponseV2);
            expect(response.getBody()).toBe('{"async": true}');
            expect(response.getStatusCode()).toBe(202);
        });
    });

    describe('template loading', () => {
        it('should load body template and endpoint from RESTDataStore when name and method provided', () => {
            const template = new RESTMessageTemplate('MyAPI');
            template.addMethod('getData', '{"filter": "${filter_value}"}');
            template.methods['getData'].setDefaultEndpoint('https://api.example.com/data');
            RESTDataStore.getInstance().addRESTMessageTemplate(template);

            const rm = new MockRESTMessageV2('MyAPI', 'getData');
            expect(rm.bodyTemplate).toBe('{"filter": "${filter_value}"}');
            expect(rm.getEndpoint()).toBe('https://api.example.com/data');
        });
    });
});

describe('MockRESTResponseV2', () => {
    beforeEach(() => {
        RESTDataStore.getInstance().clearMockData();
    });

    it('should return the configured body', () => {
        RESTDataStore.getInstance().mockResponseBody = 'response body';
        const rm = new MockRESTMessageV2();
        const response = rm.execute();
        expect(response.getBody()).toBe('response body');
    });

    it('should return the configured status code', () => {
        RESTDataStore.getInstance().mockResponseCode = 500;
        const rm = new MockRESTMessageV2();
        const response = rm.execute();
        expect(response.getStatusCode()).toBe(500);
    });

    it('should return the request that created it', () => {
        const rm = new MockRESTMessageV2();
        const response = rm.execute();
        expect(response.getRequest()).toBe(rm);
    });

    it('should report error status from data store', () => {
        RESTDataStore.getInstance().hasError = true;
        const rm = new MockRESTMessageV2();
        const response = rm.execute();
        expect(response.haveError()).toBe(true);
    });

    it('should return empty headers by default', () => {
        const rm = new MockRESTMessageV2();
        const response = rm.execute();
        expect(response.getHeaders()).toEqual({});
    });
});
