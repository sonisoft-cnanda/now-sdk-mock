import { MockAbstractAjaxProcessor } from '../../src/@servicenow/glide/MockAbstractAjaxProcessor';

describe('MockAbstractAjaxProcessor', () => {
    let ajax: MockAbstractAjaxProcessor;

    beforeEach(() => {
        ajax = new MockAbstractAjaxProcessor();
    });

    it('should create an instance', () => {
        expect(ajax).toBeDefined();
    });

    it('should accept constructor arguments', () => {
        const proc = new MockAbstractAjaxProcessor({ url: '/test' }, '<xml/>', { context: true });
        expect(proc).toBeDefined();
    });

    describe('stub methods', () => {
        it('process should return empty string', () => {
            expect(ajax.process()).toBe('');
        });

        it('newItem should return empty object', () => {
            expect(ajax.newItem('item')).toEqual({});
        });

        it('getParameter should return empty string', () => {
            expect(ajax.getParameter('sysparm_name')).toBe('');
        });

        it('getDocument should return empty object', () => {
            expect(ajax.getDocument()).toEqual({});
        });

        it('getRootElement should return empty object', () => {
            expect(ajax.getRootElement()).toEqual({});
        });

        it('getName should return empty string', () => {
            expect(ajax.getName()).toBe('');
        });

        it('getValue should return empty string', () => {
            expect(ajax.getValue()).toBe('');
        });

        it('getType should return empty string', () => {
            expect(ajax.getType()).toBe('');
        });

        it('getChars should return empty string', () => {
            expect(ajax.getChars()).toBe('');
        });
    });

    describe('setter methods', () => {
        it('setAnswer should not throw', () => {
            expect(() => ajax.setAnswer('answer')).not.toThrow();
        });

        it('setError should not throw', () => {
            expect(() => ajax.setError('error')).not.toThrow();
        });
    });

    describe('jest mock tracking', () => {
        it('should track process calls', () => {
            ajax.process();
            ajax.process();
            expect(ajax.process).toHaveBeenCalledTimes(2);
        });

        it('should track getParameter calls with arguments', () => {
            ajax.getParameter('sysparm_name');
            expect(ajax.getParameter).toHaveBeenCalledWith('sysparm_name');
        });

        it('should track setAnswer calls', () => {
            ajax.setAnswer('result');
            expect(ajax.setAnswer).toHaveBeenCalledWith('result');
        });
    });

    describe('type property', () => {
        it('should default to empty string', () => {
            expect(ajax.type).toBe('');
        });

        it('should be settable', () => {
            ajax.type = 'MyAjaxProcessor';
            expect(ajax.type).toBe('MyAjaxProcessor');
        });
    });
});
