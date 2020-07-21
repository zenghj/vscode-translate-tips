import * as vscode from 'vscode';
import * as chokidar from 'chokidar';
import { cleanModuleCache } from './util/index';
let localesJson:any = {};


function setLocalesJson(file:string) {
  localesJson = require(file);
  chokidar.watch(file)
    .on('change', (event, path) => {
      console.log('localesJson file change');
      cleanModuleCache(file);
      localesJson = require(file);
    });
}
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "test" is now active!');
  const config = vscode.workspace.getConfiguration('translate-tips');
  const keyReg = config.get('keyReg') && new RegExp(config.get('keyReg') || '.*');
  const localeFilePath = config.get('localeFilePath');
  console.log('keyReg: ', keyReg, 'localeFilePath: ', localeFilePath);
  if (!keyReg || !localeFilePath) {
    console.log('translate-tips plugin config invalid');
    return;
  }

  setLocalesJson(localeFilePath as string);

  const languages = ['javascript', 'vue', 'jsx', 'ts', 'tsx'];
  languages.forEach(lang => {
    vscode.languages.registerHoverProvider(
      lang,
      new class implements vscode.HoverProvider {
        provideHover(
          document: vscode.TextDocument,
          position: vscode.Position,
          _token: vscode.CancellationToken
        ): vscode.ProviderResult<vscode.Hover> {
          const range = document.getWordRangeAtPosition(position);
          const word = document.getText(range);
  
          if (word.match(keyReg)) {
            const tips = localesJson[word];
            // eslint-disable-next-line eqeqeq
            if (tips != null) {
              return new vscode.Hover(`${tips}`);
            } else {
              return new vscode.Hover('null');
            }
          }
        }
      }()
    );
  });

}

// this method is called when your extension is deactivated
export function deactivate() {}
