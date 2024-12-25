import * as vscode from 'vscode';

const hackyCssInjection = objectToCssString({ top: '-.25em', position: 'absolute', transform: 'rotate(45deg)' });

const lengthOfAnimation = 500;
export function activate(context: vscode.ExtensionContext) {
  let timeout: NodeJS.Timeout | undefined = undefined;

  let activeEditor = vscode.window.activeTextEditor;
  let previousDecorationType: vscode.TextEditorDecorationType | undefined;
  function updateDecorations() {
    // Do run if we don't have an active editor OR the cursor is not at the end of the line (doesnt look good whe it overlaps)
    if (
      !activeEditor ||
      activeEditor?.document.lineAt(activeEditor.selection.active).range.end.character - 1 !=
        activeEditor.selection.active.character
    ) {
      return;
    }
    const cursorPosition = new vscode.Range(activeEditor.selection.active, activeEditor.selection.active);
    const confettiDecorationType = vscode.window.createTextEditorDecorationType({
      after: {
        // inject the SVG data uri as content icon so we can use an animated SVG as the decoration, uses Date.now as the id for the SVG so that they are always uniuqe instances to prevent duplicates that would then sync up and look silly.
        contentIconPath: getSvgDataUri(Date.now().toString()), // vscode.Uri.parse(`data:image/svg+xml,%3Csvg version='1.1' id='Clippy' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 126 219'%3E%3Cstyle%3E .st1%7Bfill:none;stroke:%233e252e;stroke-width:11;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10%7D.st2%7Bfill:%23ededed%7D.st3%7Bfill:%233e252e%7D %3C/style%3E%3Cpath id='Body' d='M48 109s-3 57 25 53c17-3 5-37 7-64 3-42 26-74-3-89C47-6 22 46 22 109s26 103 55 102 32-33 27-64c-5-34 15-49 15-49' style='fill:none;stroke:%23afb0b0;stroke-width:11;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10'%3E%3C/path%3E%3Cpath id='R-Brow' class='st1' d='M105 47s-8-9-22-10'%3E%3C/path%3E%3Cpath id='L-Brow' class='st1' d='M51 24s-7-6-24 0'%3E%3C/path%3E%3Ccircle id='L-Eye' class='st2' cx='24.1' cy='62.2' r='23'%3E%3C/circle%3E%3Ccircle id='R-Eye' class='st2' cx='85.6' cy='77.8' r='23'%3E%3C/circle%3E%3Cellipse id='R-Pupil' class='st3' cx='81.8' cy='77.5' rx='15.8' ry='15.7'%3E%3C/ellipse%3E%3Cellipse id='L-Pupil' class='st3' cx='28.1' cy='62.2' rx='15.5' ry='16'%3E%3C/ellipse%3E%3C/svg%3E`),
        // Hackily inject some custom CSS that is totally not really allowed but I can so I will,
        // cause it is more noticeable and a little nicer when its bigger but has to be absolutely
        // positioned to prevent the icon from pushing the text down off the current line when its larger than 1em.
        //margin: `0; ${hackyCssInjection}`,
        width: '2em',
      },
    });

    // remove any previous decorations in case any start/are added before the timeout disposed of it.
    //previousDecorationType?.dispose();

    // add new decoration
    activeEditor.setDecorations(confettiDecorationType, [cursorPosition]);

    // save the decoration type to remove it on the next update becuase we dont want 2 of these at the same time, it would overlap and look silly.
    //previousDecorationType = confettiDecorationType;

    // Setup a timeout to remove the decoration after the length of the animation.
    // new Promise((resolve) => setTimeout(resolve, lengthOfAnimation)).then(() => {
    //   confettiDecorationType?.dispose();
    // });
  }

  function triggerUpdateDecorations(throttle = false) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    if (throttle) {
      timeout = setTimeout(updateDecorations, 300);
    } else {
      updateDecorations();
    }
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );
}

const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;

function encodeSVG(data: string) {
  data = data.replace(/"/g, `'`);
  //data = data.replace(/\n/g, `  `);
  data = data.replace(/>\s{1,}</g, `><`);
  data = data.replace(/\s{2,}/g, ` `);

  // Using encodeURIComponent() as replacement function
  // allows to keep result code readable
  return data.replace(symbols, encodeURIComponent);
}

function getSvgDataUri(id: string) {
  const svg = `<svg version="1.1" id="Clippy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 219">
  <style>
    .st1{fill:none;stroke:#3e252e;stroke-width:11;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}.st2{fill:#ededed}.st3{fill:#3e252e}
  </style>
  <path id="Body" d="M48 109s-3 57 25 53c17-3 5-37 7-64 3-42 26-74-3-89C47-6 22 46 22 109s26 103 55 102 32-33 27-64c-5-34 15-49 15-49" style="fill:none;stroke:#afb0b0;stroke-width:11;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10"></path>
  <path id="R-Brow" class="st1" d="M105 47s-8-9-22-10"></path>
  <path id="L-Brow" class="st1" d="M51 24s-7-6-24 0"></path>
  <circle id="L-Eye" class="st2" cx="24.1" cy="62.2" r="23"></circle>
  <circle id="R-Eye" class="st2" cx="85.6" cy="77.8" r="23"></circle>
  <ellipse id="R-Pupil" class="st3" cx="81.8" cy="77.5" rx="15.8" ry="15.7"></ellipse>
  <ellipse id="L-Pupil" class="st3" cx="28.1" cy="62.2" rx="15.5" ry="16"></ellipse>
</svg>`;
console.log(vscode.Uri.parse(`data:image/svg+xml,${encodeSVG(svg)}`));
  return vscode.Uri.parse(`data:image/svg+xml,${encodeSVG(svg)}`);
}

function objectToCssString(styles: Record<string, unknown>): string {
  return Object.entries(styles)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}
