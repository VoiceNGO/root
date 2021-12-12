"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// temporary workaround while we wait for https://github.com/facebook/jest/issues/9771
const enhanced_resolve_1 = require("enhanced-resolve");
const fs_1 = require("fs");
const extensions = ['.js', '.jsx', '.json', '.node', '.ts', '.tsx'];
const importResolver = enhanced_resolve_1.create.sync({
    conditionNames: ['import', 'node', 'default'],
    extensions,
});
const requireResolver = enhanced_resolve_1.create.sync({
    conditionNames: ['require', 'node', 'default'],
    extensions,
});
function default_1(request, options) {
    (0, fs_1.writeFile)('/voice/modules/node-build-tools/out.txt', JSON.stringify({ request, options }), () => { });
    let resolver = requireResolver;
    if (options.conditions?.includes('import')) {
        resolver = importResolver;
    }
    return resolver(options.basedir, request);
}
exports.default = default_1;
