"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enhanced_resolve_1 = require("enhanced-resolve");
const resolver = enhanced_resolve_1.create.sync({
    conditionNames: ['require', 'node', 'default'],
    extensions: [
        '.cjs',
        '.cts',
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.mts',
        '.ts',
        '.tsx',
    ],
});
module.exports = function (request, options) {
    // use the defauly resolver for all built-in node modules
    if ([
        'assert',
        'buffer',
        'child_process',
        'cluster',
        'crypto',
        'dgram',
        'dns',
        'events',
        'fs',
        'http',
        'https',
        'net',
        'os',
        'path',
        'querystring',
        'readline',
        'stream',
        'string_decoder',
        'timers',
        'tls',
        'url',
        'util',
        'vm',
        'zlib',
    ].includes(request)) {
        return options.defaultResolver(request, options);
    }
    return resolver(options.basedir, request);
};
