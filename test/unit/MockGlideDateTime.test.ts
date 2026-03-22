import { MockGlideDateTime } from '../../src/@servicenow/glide/MockGlideDateTime';
import { MockGlideDate } from '../../src/@servicenow/glide/MockGlideDate';
import { MockGlideTime } from '../../src/@servicenow/glide/MockGlideTime';

describe('MockGlideDateTime', () => {
    describe('constructor', () => {
        it('should create with current date when no argument', () => {
            const before = Date.now();
            const gdt = new MockGlideDateTime();
            const after = Date.now();
            const ts = gdt.dateInstance.getTime();
            expect(ts).toBeGreaterThanOrEqual(before);
            expect(ts).toBeLessThanOrEqual(after);
        });

        it('should parse an ISO string', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            expect(gdt.dateInstance.getUTCFullYear()).toBe(2024);
            expect(gdt.dateInstance.getUTCMonth()).toBe(5); // 0-indexed
            expect(gdt.dateInstance.getUTCDate()).toBe(15);
            expect(gdt.dateInstance.getUTCHours()).toBe(10);
            expect(gdt.dateInstance.getUTCMinutes()).toBe(30);
        });

        it('should handle null by defaulting to current date', () => {
            const gdt = new MockGlideDateTime(null);
            expect(gdt.dateInstance).toBeInstanceOf(Date);
        });
    });

    describe('toString', () => {
        it('should return an ISO string', () => {
            const gdt = new MockGlideDateTime('2024-01-15T08:00:00.000Z');
            expect(gdt.toString()).toBe('2024-01-15T08:00:00.000Z');
        });
    });

    describe('getNumericValue', () => {
        it('should return epoch milliseconds', () => {
            const gdt = new MockGlideDateTime('2024-01-01T00:00:00.000Z');
            expect(gdt.getNumericValue()).toBe(new Date('2024-01-01T00:00:00.000Z').getTime());
        });
    });

    describe('getDate', () => {
        it('should return a MockGlideDate', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            const d = gdt.getDate();
            expect(d).toBeInstanceOf(MockGlideDate);
        });
    });

    describe('getTime', () => {
        it('should return a MockGlideTime', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            const t = gdt.getTime();
            expect(t).toBeInstanceOf(MockGlideTime);
        });
    });

    describe('UTC accessors', () => {
        it('should return UTC year', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            expect(gdt.getYearUTC()).toBe(2024);
        });

        it('should return UTC month (1-indexed)', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            expect(gdt.getMonthUTC()).toBe(6);
        });

        it('should return UTC day of month', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            expect(gdt.getDayOfMonthUTC()).toBe(15);
        });
    });

    describe('local time accessors', () => {
        it('should return local year', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            expect(gdt.getYearLocalTime()).toBe(gdt.dateInstance.getFullYear());
        });

        it('should return local month (1-indexed)', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            expect(gdt.getMonthLocalTime()).toBe(gdt.dateInstance.getMonth() + 1);
        });

        it('should return local day of month', () => {
            const gdt = new MockGlideDateTime('2024-06-15T10:30:00.000Z');
            expect(gdt.getDayOfMonthLocalTime()).toBe(gdt.dateInstance.getDate());
        });
    });

    describe('addSeconds', () => {
        it('should advance the date by given seconds', () => {
            const gdt = new MockGlideDateTime('2024-01-01T00:00:00.000Z');
            gdt.addSeconds(60);
            expect(gdt.dateInstance.getUTCMinutes()).toBe(1);
        });

        it('should handle large second values', () => {
            const gdt = new MockGlideDateTime('2024-01-01T00:00:00.000Z');
            gdt.addSeconds(3600); // 1 hour
            expect(gdt.dateInstance.getUTCHours()).toBe(1);
        });
    });

    describe('add (milliseconds)', () => {
        it('should advance the date by given milliseconds', () => {
            const gdt = new MockGlideDateTime('2024-01-01T00:00:00.000Z');
            const originalTime = gdt.getNumericValue();
            gdt.add(5000);
            expect(gdt.getNumericValue()).toBe(originalTime + 5000);
        });
    });
});

describe('MockGlideDate', () => {
    describe('constructor', () => {
        it('should use current date when no argument', () => {
            const gd = new MockGlideDate();
            expect(gd._mockDate).toBeInstanceOf(Date);
        });

        it('should use provided date', () => {
            const date = new Date('2024-03-20');
            const gd = new MockGlideDate(date);
            expect(gd._mockDate).toBe(date);
        });
    });

    describe('getByFormat', () => {
        // Use a midday UTC time to avoid timezone edge cases with local getDate()
        const date = new Date('2024-03-15T12:00:00.000Z');

        it('should format yyyy', () => {
            const gd = new MockGlideDate(date);
            expect(gd.getByFormat('yyyy')).toBe('2024');
        });

        it('should format MM with leading zero', () => {
            const gd = new MockGlideDate(date);
            expect(gd.getByFormat('MM')).toBe('03');
        });

        it('should format dd with leading zero', () => {
            const gd = new MockGlideDate(date);
            expect(gd.getByFormat('dd')).toBe('15');
        });

        it('should return ISO string for unknown format', () => {
            const gd = new MockGlideDate(date);
            const result = gd.getByFormat('unknown');
            expect(result).toContain('2024');
        });
    });
});

describe('MockGlideTime', () => {
    const date = new Date('2024-06-15T09:05:07.000Z');

    describe('getByFormat', () => {
        it('should format full datetime', () => {
            const gt = new MockGlideTime(date);
            const result = gt.getByFormat('yyyy-MM-dd HH:mm:ss');
            expect(result).toContain('2024');
        });

        it('should format yyyy', () => {
            const gt = new MockGlideTime(date);
            expect(gt.getByFormat('yyyy')).toBe('2024');
        });

        it('should format MM with leading zero', () => {
            const gt = new MockGlideTime(date);
            expect(gt.getByFormat('MM')).toBe('06');
        });

        it('should format dd with leading zero', () => {
            const gt = new MockGlideTime(date);
            expect(gt.getByFormat('dd')).toBe('15');
        });

        it('should format HH with leading zero', () => {
            const gt = new MockGlideTime(date);
            expect(gt.getByFormat('HH')).toBe('09');
        });

        it('should format mm with leading zero', () => {
            const gt = new MockGlideTime(date);
            expect(gt.getByFormat('mm')).toBe('05');
        });

        it('should format ss with leading zero', () => {
            const gt = new MockGlideTime(date);
            expect(gt.getByFormat('ss')).toBe('07');
        });
    });
});
