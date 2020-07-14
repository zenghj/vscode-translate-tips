export function cleanModuleCache(modulePath:string) {
  const file = require.resolve(modulePath);
  const module:any = require.cache[file];
  // remove reference in module.parent
  if (module.parent) {
      module.parent.children.splice(module.parent.children.indexOf(module), 1);
  }
  require.cache[file] = undefined;
}