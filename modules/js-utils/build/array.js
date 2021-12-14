"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterInPlace = void 0;
function filterInPlace(ary, condition, thisArg) {
    let outIndex = 0;
    ary.forEach((element, curIndex) => {
        if (condition.call(thisArg, element, curIndex, ary)) {
            ary[outIndex] = element;
            outIndex++;
        }
    });
    ary.length = outIndex;
    return ary;
}
exports.filterInPlace = filterInPlace;
