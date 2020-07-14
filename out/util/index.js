"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanModuleCache = void 0;
function cleanModuleCache(modulePath) {
    const file = require.resolve(modulePath);
    const module = require.cache[file];
    // remove reference in module.parent
    if (module.parent) {
        module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }
    require.cache[file] = undefined;
}
exports.cleanModuleCache = cleanModuleCache;
//# sourceMappingURL=index.js.map