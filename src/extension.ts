import * as vscode from 'vscode';
import miniSvgToDataUri from 'mini-svg-data-uri';

const lengthOfAnimation = 500;
export function activate(context: vscode.ExtensionContext) {
  let timeout: NodeJS.Timeout | undefined = undefined;
  let activeEditor = vscode.window.activeTextEditor;
  let previousDecorationType: vscode.TextEditorDecorationType | undefined;
  const basicDecorationStyleAdjustments = { top: '-.25em', position: 'absolute', transform: 'rotate(45deg)' };

  function updateDecorations() {
    // Do run if we don't have an active editor OR the cursor is not at the end of the line (doesn't look good whe it overlaps)
    if (
      !activeEditor ||
      activeEditor?.document.lineAt(activeEditor.selection.active).range.end.character - 1 !=
        activeEditor.selection.active.character
    ) {
      return;
    }

    const cursorPosition = new vscode.Range(activeEditor.selection.active, activeEditor.selection.active);
    const hackyCssInjection = {
      ...basicDecorationStyleAdjustments,
      content: `url("${getSvgDataUri(Date.now().toString())}")`,
    };
    const confettiDecorationType = vscode.window.createTextEditorDecorationType({
      after: {
        // inject the SVG data uri as content icon so we can use an animated SVG as the decoration, uses Date.now as the id for the SVG so that they are always unique instances to prevent duplicates that would then sync up and look silly.
        // For some reason the `vscode.Uri.parse` approach broke and its removing spaces around attributes and causing the SVG to not render correctly, so lets use hacky CSS injection instead.
        //contentIconPath: vscode.Uri.parse(getSvgDataUri(Date.now().toString())
        contentText: ``, // This gets overwritten by the hackyCssInjection so it doesn't matter what it is.
        // Hackily inject some custom CSS that is totally not really allowed but I can so I will,
        // cause it is more noticeable and a little nicer when its bigger but has to be absolutely
        // positioned to prevent the icon from pushing the text down off the current line when its larger than 1em.
        margin: `0; ${objectToCssString(hackyCssInjection)}`,
        width: '2em',
      },
    });

    // remove any previous decorations in case any start/are added before the timeout disposed of it.
    previousDecorationType?.dispose();

    // add new decoration
    activeEditor.setDecorations(confettiDecorationType, [cursorPosition]);

    // save the decoration type to remove it on the next update because we don't want 2 of these at the same time, it would overlap and look silly.
    previousDecorationType = confettiDecorationType;

    // Setup a timeout to remove the decoration after the length of the animation.
    new Promise((resolve) => setTimeout(resolve, lengthOfAnimation)).then(() => {
      confettiDecorationType?.dispose();
    });
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

function getSvgDataUri(id: string) {
  // SVG is derived from https://codepen.io/lilianqian/pen/OxzeyZ
  const svg = `<svg
  version="1.1"
  id="${id}"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="100 70 250 300"
  style="position: absolute"
  overflow="visible">
  <style>
    @keyframes confdash {
      0%,
      2% {
        stroke-dasharray: 1000;
        stroke-dashoffset: 500;
        transform: translate(-30px, 30px);
        opacity: 0;
      }
      35% {
        stroke-dasharray: 1000;
        stroke-dashoffset: 900;
        transform: translate(-2px, 0);
        opacity: 1;
      }
      85% {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        transform: translate(1px, -5px);
        opacity: 1;
      }
      90% {
        stroke-dashoffset: 1000;
        transform: translate(2px, -8px);
        opacity: 0;
      }
      to {
        stroke-dashoffset: 500;
        transform: translate(2px, -8px);
        opacity: 0;
      }
    }
    @keyframes confa {
      0% {
        opacity: 0;
        transform: translate(-30px, 20px) rotate(0);
      }
      15% {
        opacity: 1;
        transform: translate(25px, -10px) rotate(60deg);
      }
      80% {
        opacity: 1;
        transform: translate(33px, -18px) rotate(180deg);
      }
      to {
        opacity: 0;
        transform: translate(37px, -23px) scale(0.5) rotate(230deg);
      }
    }
    @keyframes confb {
      0% {
        opacity: 0;
        transform: translate(-30px, 20px) rotate(0);
      }
      12% {
        opacity: 1;
        transform: translate(25px, -10px) rotate(60deg);
      }
      76% {
        opacity: 1;
        transform: translate(33px, -18px) rotate(180deg);
      }
      to {
        opacity: 0;
        transform: translate(37px, -23px) scale(0.5) rotate(240deg);
      }
    }
    @keyframes confc {
      0% {
        opacity: 0.7;
        transform: translate(-30px, 20px) rotate(0);
      }
      18% {
        opacity: 1;
        transform: translate(5px, -10px) rotate(60deg);
      }
      76% {
        opacity: 1;
        transform: translate(13px, -18px) rotate(180deg);
      }
      to {
        opacity: 0;
        transform: translate(17px, -23px) scale(0.5) rotate(230deg);
      }
    }
    @keyframes confd {
      0% {
        opacity: 0.7;
        transform: translate(-20px, 20px) rotate(0);
      }
      18% {
        opacity: 1;
        transform: translate(-5px, -10px) rotate(60deg);
      }
      76% {
        opacity: 1;
        transform: translate(-8px, -18px) rotate(180deg);
      }
      to {
        opacity: 0;
        transform: translate(-10px, -23px) scale(0.5) rotate(230deg);
      }
    }
    .conf0 {
      fill: #fc6394;
    }
    .conf2 {
      fill: #5adaea;
    }
    .conf3 {
      fill: #974cbe;
    }
    .conf6 {
      fill: #f9b732;
    }
    .yellow-strip,
    .conf7,
    .conf8 {
      fill: none;
      stroke-miterlimit: 10;
    }
    .conf7 {
      display: none;
      stroke: #000;
    }
    .yellow-strip,
    .conf8 {
      stroke: #f9b732;
      stroke-width: 9;
      stroke-linecap: round;
    }
    .yellow-strip {
      animation: confdash 0.5s ease 1;
    }
  </style>
  <circle
    class="conf2"
    cx="195.2"
    cy="232.6"
    r="5.1"
    style="animation: confb 0.5s ease-out 1"
    transform-origin="195.2px 232.6px"
  />
  <circle
    class="conf0"
    cx="230.8"
    cy="219.8"
    r="5.4"
    style="animation: confb 0.5s ease-out 1"
    transform-origin="230.8px 219.8px"
  />
  <circle
    class="conf0"
    cx="178.9"
    cy="160.4"
    r="4.2"
    style="animation: confc 0.5s ease-out 1"
    transform-origin="178.9px 156.2px"
  />
  <circle
    class="conf6"
    cx="132.8"
    cy="123.6"
    r="5.4"
    style="animation: confd 0.5s ease-out 1"
    transform-origin="133px 118px"
  />
  <circle
    class="conf0"
    cx="151.9"
    cy="105.1"
    r="5.4"
    style="animation: confd 0.5s ease-out 1"
    transform-origin="152px 100px"
  />
  <path
    class="conf0"
    d="m129.9 176.1-5.7 1.3c-1.6.4-2.2 2.3-1.1 3.5l3.8 4.2c1.1 1.2 3.1.8 3.6-.7l1.9-5.5c.5-1.6-.9-3.2-2.5-2.8z"
    style="animation: confd 0.5s ease-out 1"
    transform-origin="127px 176px"
  />
  <path
    class="conf6"
    d="m284.5 170.7-5.4 1.2c-1.5.3-2.1 2.2-1 3.3l3.6 3.9c1 1.1 2.9.8 3.4-.7l1.8-5.2c.5-1.3-.8-2.8-2.4-2.5z"
    style="animation: confb 0.5s ease-out 1"
    transform-origin="282.3px 170.6px"
  />
  <circle
    class="conf6"
    cx="206.7"
    cy="144.4"
    r="4.5"
    style="animation: confc 0.5s ease-out 1"
    transform-origin="206.7px 140px"
  />
  <path
    class="conf2"
    d="M176.4 192.3h-3.2c-1.6 0-2.9-1.3-2.9-2.9v-3.2c0-1.6 1.3-2.9 2.9-2.9h3.2c1.6 0 2.9 1.3 2.9 2.9v3.2c0 1.6-1.3 2.9-2.9 2.9z"
    style="animation: confc 0.5s ease-out 1"
    transform-origin="174.8px 183.4px"
  />
  <path
    class="conf2"
    d="M263.7 197.4h-3.2c-1.6 0-2.9-1.3-2.9-2.9v-3.2c0-1.6 1.3-2.9 2.9-2.9h3.2c1.6 0 2.9 1.3 2.9 2.9v3.2c-.1 1.6-1.4 2.9-2.9 2.9z"
    style="animation: confb 0.5s ease-out 1"
    transform-origin="262px 188.5px"
  />
  <path
    class="yellow-strip"
    d="M179.7 102.4s6.6 15.3-2.3 25c-8.9 9.7-24.5 9.7-29.7 15.6-5.2 5.9-.7 18.6 3.7 28.2 4.5 9.7 2.2 23-10.4 28.2"
  />
  <path
    class="yellow-strip conf8"
    d="M252.2 156.1s-16.9-3.5-28.8 2.4c-11.9 5.9-14.9 17.8-16.4 29-1.5 11.1-4.3 28.8-31.5 33.4"
  />
  <path
    class="conf0"
    d="M277.5 254.8h-3.2c-1.6 0-2.9-1.3-2.9-2.9v-3.2c0-1.6 1.3-2.9 2.9-2.9h3.2c1.6 0 2.9 1.3 2.9 2.9v3.2c0 1.6-1.3 2.9-2.9 2.9z"
    style="animation: confa 0.5s ease-out 1"
    transform-origin="276px 246px"
  />
  <path
    class="conf3"
    d="M215.2 121.3c.3.6.8 1 1.5 1.1 1.6.2 2.2 2.2 1.1 3.3-.5.4-.7 1.1-.6 1.7.3 1.6-1.4 2.8-2.8 2-.6-.3-1.2-.3-1.8 0-1.4.7-3.1-.5-2.8-2 .1-.6-.1-1.3-.6-1.7-1.1-1.1-.5-3.1 1.1-3.3.6-.1 1.2-.5 1.5-1.1.7-1.5 2.7-1.5 3.4 0z"
    style="animation: confc 0.5s ease-out 1"
    transform-origin="213.5px 120.2px"
  />
  <path
    class="conf3"
    d="M224.5 191.7c.3.6.8 1 1.5 1.1 1.6.2 2.2 2.2 1.1 3.3-.5.4-.7 1.1-.6 1.7.3 1.6-1.4 2.8-2.8 2-.6-.3-1.2-.3-1.8 0-1.4.7-3.1-.5-2.8-2 .1-.6-.1-1.3-.6-1.7-1.1-1.1-.5-3.1 1.1-3.3.6-.1 1.2-.5 1.5-1.1.6-1.5 2.7-1.5 3.4 0z"
    style="animation: confb 0.5s ease-out 1"
    transform-origin="222.8px 190.6px"
  />
  <path
    class="conf3"
    d="M312.6 242.1c.3.6.8 1 1.5 1.1 1.6.2 2.2 2.2 1.1 3.3-.5.4-.7 1.1-.6 1.7.3 1.6-1.4 2.8-2.8 2-.6-.3-1.2-.3-1.8 0-1.4.7-3.1-.5-2.8-2 .1-.6-.1-1.3-.6-1.7-1.1-1.1-.5-3.1 1.1-3.3.6-.1 1.2-.5 1.5-1.1.7-1.5 2.7-1.5 3.4 0z"
    style="animation: confa 0.5s ease-out 1"
    transform-origin="310.9px 241px"
  />
  <path
    class="yellow-strip conf8"
    d="M290.7 215.4s-14.4-3.4-22.6 2.7c-8.2 6.2-8.2 23.3-17.1 29.4-8.9 6.2-19.8-2.7-32.2-4.1-12.3-1.4-19.2 5.5-20.5 10.9"
  />
</svg>`;

  const dataUri = miniSvgToDataUri(svg.replace(/\n/gm, ' ')).replace(/ /g, '%20');
  return dataUri;
}

function objectToCssString(styles: Record<string, unknown>): string {
  return Object.entries(styles)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
}
