"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("../array");
describe('filterInPlace', () => {
    const srcArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let testArray;
    beforeEach(() => {
        testArray = srcArray.slice();
    });
    test('returns same array', () => {
        const response = (0, array_1.filterInPlace)(testArray, () => true);
        expect(response).toBe(testArray);
    });
    test('filter odds', () => {
        expect((0, array_1.filterInPlace)(testArray, (n) => Boolean(n & 1))).toEqual([
            1, 3, 5, 7, 9,
        ]);
    });
});
