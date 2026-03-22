import { DBUtil } from '../../src/common/DBUtil';

describe('DBUtil', () => {
    describe('tryParseInt', () => {
        it('should parse a valid integer string', () => {
            let result: { isParsed: boolean; value?: number } = { isParsed: false };
            DBUtil.tryParseInt('42', (isParsed, value) => {
                result = { isParsed, value };
            });
            expect(result.isParsed).toBe(true);
            expect(result.value).toBe(42);
        });

        it('should fail for non-numeric string', () => {
            let result: { isParsed: boolean; value?: number } = { isParsed: false };
            DBUtil.tryParseInt('hello', (isParsed, value) => {
                result = { isParsed, value };
            });
            expect(result.isParsed).toBe(false);
        });

        it('should parse negative numbers', () => {
            let result: { isParsed: boolean; value?: number } = { isParsed: false };
            DBUtil.tryParseInt('-10', (isParsed, value) => {
                result = { isParsed, value };
            });
            expect(result.isParsed).toBe(true);
            expect(result.value).toBe(-10);
        });

        it('should parse zero', () => {
            let result: { isParsed: boolean; value?: number } = { isParsed: false };
            DBUtil.tryParseInt('0', (isParsed, value) => {
                result = { isParsed, value };
            });
            expect(result.isParsed).toBe(true);
            expect(result.value).toBe(0);
        });
    });
});
