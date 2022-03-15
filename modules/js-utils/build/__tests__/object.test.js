"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_js_1 = require("../object.js");
test('invert', () => {
    expect((0, object_js_1.invert)({ x: 10, y: 20, z: {} })).toEqual({
        '10': 'x',
        '20': 'y',
        '[object Object]': 'z',
    });
});
test('pick', () => {
    const xyz = { x: 10, y: 20, z: 30 };
    expect((0, object_js_1.pick)(xyz)).toEqual({});
    expect((0, object_js_1.pick)(xyz, 'x')).toEqual({ x: 10 });
    expect((0, object_js_1.pick)(xyz, 'x', 'y')).toEqual({ x: 10, y: 20 });
    expect((0, object_js_1.pick)(xyz, 'x', 'y', 'z')).toEqual({ x: 10, y: 20, z: 30 });
});
