"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const chokidar = require("chokidar");
const index_1 = require("./util/index");
let localesJson = {};
function setLocalesJson(file) {
    localesJson = require(file);
    chokidar.watch(file)
        .on('change', (event, path) => {
        console.log('localesJson file change');
        index_1.cleanModuleCache(file);
        localesJson = require(file);
    });
}
function activate(context) {
    console.log('Congratulations, your extension "test" is now active!');
    const config = vscode.workspace.getConfiguration('translate-tips');
    const keyReg = config.get('keyReg') && new RegExp(config.get('keyReg') || '.*');
    const localeFilePath = config.get('localeFilePath');
    console.log('keyReg: ', keyReg, 'localeFilePath: ', localeFilePath);
    if (!keyReg || !localeFilePath) {
        console.log('translate-tips plugin config invalid');
        return;
    }
    setLocalesJson(localeFilePath);
    const languages = ['javascript', 'vue', 'jsx', 'ts', 'tsx'];
    languages.forEach(lang => {
        vscode.languages.registerHoverProvider(lang, new class {
            provideHover(document, position, _token) {
                const range = document.getWordRangeAtPosition(position);
                const word = document.getText(range);
                if (word.match(keyReg)) {
                    const tips = localesJson[word];
                    // eslint-disable-next-line eqeqeq
                    if (tips != null) {
                        return new vscode.Hover(`${tips}`);
                    }
                    else {
                        return new vscode.Hover('null');
                    }
                }
            }
        }());
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map