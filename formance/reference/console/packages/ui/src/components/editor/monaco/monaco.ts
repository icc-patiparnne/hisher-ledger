import type { editor } from 'monaco-editor';

// Shared constants
export const CTRL_ENTER_EVENT = 'monacoCtrlEnter';

// Theme configurations
export const monacoLightTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '999988', fontStyle: 'italic' },
    { token: 'string', foreground: '74739e' },
    { token: 'number', foreground: '1C5655' },
    { token: 'keyword', foreground: '507051' },
    { token: 'property', foreground: '247372' },
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#3e3838',
    'editor.lineHighlightBackground': '#ebf0f066',
    'editorLineNumber.foreground': '#5B7083',
    'editor.selectionBackground': '#ebf0f099',
  },
};

export const monacoDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '999988', fontStyle: 'italic' },
    { token: 'string', foreground: '7a78b5' },
    { token: 'number', foreground: '36ACAA' },
    { token: 'keyword', foreground: '97c39a' },
    { token: 'property', foreground: '36acaa' },
  ],
  colors: {
    'editor.background': '#01353c',
    'editor.foreground': '#D9E6E7',
    'editor.lineHighlightBackground': '#024851',
    'editorLineNumber.foreground': '#5B7083',
    'editor.selectionBackground': '#024851',
  },
};

export const MONOACO_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions =
  {
    automaticLayout: true,
    scrollBeyondLastLine: false,
    overviewRulerBorder: false,
    fontFamily: 'Space Mono',
    fontSize: 14,
    padding: { top: 12, bottom: 12 },
    folding: true,
    guides: {
      indentation: false,
    },
    minimap: {
      enabled: false,
    },
    quickSuggestions: false,
    matchBrackets: 'never' as const,
    lineNumbers: 'off' as const,
    bracketPairColorization: { enabled: false },
  };

/**
 * Configures Monaco environment to avoid web worker warnings.
 * This should be called before creating any Monaco editor instances.
 */
export const setupMonacoEnvironment = (): void => {
  if (typeof window !== 'undefined' && !window.MonacoEnvironment) {
    window.MonacoEnvironment = {
      getWorkerUrl: () => {
        // Disable workers by returning a blob URL with minimal worker code
        // This prevents web worker warnings while keeping functionality
        const blob = new Blob([''], { type: 'application/javascript' });

        return URL.createObjectURL(blob);
      },
    };
  }
};
