import type { Monaco } from '@monaco-editor/react';

export function registerOpenSCADLanguage(monaco: Monaco) {
  // Check if already registered
  if (
    monaco.languages
      .getLanguages()
      .some((lang: { id: string }) => lang.id === 'openscad')
  ) {
    return;
  }

  monaco.languages.register({ id: 'openscad' });

  monaco.languages.setMonarchTokensProvider('openscad', {
    keywords: [
      'module',
      'function',
      'if',
      'else',
      'for',
      'let',
      'each',
      'true',
      'false',
      'undef',
    ],

    primitives: [
      'cube',
      'sphere',
      'cylinder',
      'polyhedron',
      'circle',
      'square',
      'polygon',
      'text',
      'linear_extrude',
      'rotate_extrude',
      'surface',
      'import',
    ],

    transforms: [
      'translate',
      'rotate',
      'scale',
      'mirror',
      'multmatrix',
      'color',
      'offset',
      'hull',
      'minkowski',
      'resize',
    ],

    booleans: ['union', 'difference', 'intersection'],

    builtins: [
      'abs',
      'sign',
      'sin',
      'cos',
      'tan',
      'acos',
      'asin',
      'atan',
      'atan2',
      'floor',
      'round',
      'ceil',
      'ln',
      'log',
      'pow',
      'sqrt',
      'exp',
      'rands',
      'min',
      'max',
      'concat',
      'lookup',
      'str',
      'chr',
      'ord',
      'search',
      'version',
      'version_num',
      'parent_module',
      'norm',
      'cross',
      'len',
      'echo',
      'assert',
    ],

    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.bracket' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
    ],

    tokenizer: {
      root: [
        // Identifiers and keywords
        [
          /[a-zA-Z_$][\w$]*/,
          {
            cases: {
              '@keywords': 'keyword',
              '@primitives': 'type.identifier',
              '@transforms': 'keyword.control',
              '@booleans': 'keyword.operator',
              '@builtins': 'support.function',
              '@default': 'identifier',
            },
          },
        ],

        // Whitespace
        { include: '@whitespace' },

        // Delimiters and operators
        [/[{}()[\]]/, '@brackets'],
        [/[+\-*/%=<>!&|^~?:]+/, 'operator'],

        // Numbers
        [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
        [/\d+/, 'number'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        // Special variables
        [/\$\w+/, 'variable.predefined'],
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*$/, 'comment'],
      ],

      comment: [
        [/[^/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],
    },
  });

  // Define a dark theme for OpenSCAD
  monaco.editor.defineTheme('openscad-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'C586C0' },
      { token: 'keyword.control', foreground: '569CD6' },
      { token: 'keyword.operator', foreground: 'D19A66' },
      { token: 'type.identifier', foreground: '4EC9B0' },
      { token: 'support.function', foreground: 'DCDCAA' },
      { token: 'variable.predefined', foreground: '9CDCFE' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'number.float', foreground: 'B5CEA8' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'comment', foreground: '6A9955' },
      { token: 'operator', foreground: 'D4D4D4' },
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4',
      'editorLineNumber.foreground': '#858585',
      'editorLineNumber.activeForeground': '#C6C6C6',
      'editor.selectionBackground': '#264F78',
      'editor.lineHighlightBackground': '#2D2D30',
    },
  });
}
