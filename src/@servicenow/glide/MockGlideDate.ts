export class MockGlideDate {
    _mockDate: Date
    constructor(date?:Date){
        this._mockDate = date ?? new Date()
    }
    getByFormat(format:string) {
        const date = this._mockDate
        switch (format) {
        case 'yyyy':
            return date.getFullYear().toString();
        case 'MM':
            return (date.getMonth() + 1).toString().padStart(2, '0');
        case 'dd':
            return date.getDate().toString().padStart(2, '0');
        default:
            return date.toISOString();
        }
    }
}