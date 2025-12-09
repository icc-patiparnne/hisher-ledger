import { ThemeInput, ThemeRegistrationRaw } from 'shiki';

import { monacoDarkTheme, monacoLightTheme } from '../monaco/monaco';
import formanceDarkTheme from './formance-dark.json';
import formanceLightTheme from './formance-light.json';

export const CODE_EDITOR_LANGS = [
  'typescript',
  'yaml',
  'json',
  'bash',
  'plaintext',
  'markdown',
] as const;
export type TCodeEditorLang = (typeof CODE_EDITOR_LANGS)[number];

export const CODE_THEMES_NAMES = {
  'formance-light': 'formance-light',
  'formance-dark': 'formance-dark',
} as const;

export type TShikiThemesNames = keyof typeof CODE_THEMES_NAMES;

const darktheme = formanceDarkTheme as unknown as ThemeRegistrationRaw;
const lighttheme = formanceLightTheme as unknown as ThemeRegistrationRaw;

export const shikiLightTheme: ThemeInput = {
  colors: {
    ...monacoLightTheme.colors,
  },
  settings: [
    ...(lighttheme.tokenColors || []),
    // Add basic Monaco token colors (ensure they're defined)
    {
      scope: 'comment',
      settings: {
        foreground: '#999988',
        fontStyle: 'italic',
      },
    },
    {
      scope: 'string',
      settings: {
        foreground: '#74739e',
      },
    },
    {
      scope: 'number',
      settings: {
        foreground: '#1C5655',
      },
    },
    {
      scope: 'keyword',
      settings: {
        foreground: '#507051',
      },
    },
    {
      scope: 'property',
      settings: {
        foreground: '#247372', // This covers 'source' and 'destination'
      },
    },
    // Add numscript-specific token colors
    {
      scope: 'variable',
      settings: {
        foreground: '#1C5655', // Dark teal for $variables
      },
    },
    {
      scope: 'plain',
      settings: {
        foreground: '#3e3838', // Default foreground for @accounts
      },
    },
    {
      scope: 'builtin',
      settings: {
        foreground: '#507051', // Green for built-in functions
      },
    },
    {
      scope: 'symbol',
      settings: {
        foreground: '#74739e', // Purple for symbols
      },
    },
    {
      scope: 'punctuation',
      settings: {
        foreground: '#3e3838', // Default foreground
      },
    },
  ],
  name: CODE_THEMES_NAMES['formance-light'],
  bg: '#FFFFFF',
  fg: '#3e3838',
};

export const shikiDarkTheme: ThemeInput = {
  colors: {
    ...monacoDarkTheme.colors,
  },
  settings: [
    ...(darktheme.tokenColors || []),
    // Add basic Monaco token colors (ensure they're defined)
    {
      scope: 'comment',
      settings: {
        foreground: '#999988',
        fontStyle: 'italic',
      },
    },
    {
      scope: 'string',
      settings: {
        foreground: '#cac8f9',
      },
    },
    {
      scope: 'number',
      settings: {
        foreground: '#36ACAA',
      },
    },
    {
      scope: 'keyword',
      settings: {
        foreground: '#97c39a',
      },
    },
    {
      scope: 'property',
      settings: {
        foreground: '#36acaa', // This covers 'source' and 'destination'
      },
    },
    // Add numscript-specific token colors
    {
      scope: 'variable',
      settings: {
        foreground: '#36ACAA', // Cyan for $variables
      },
    },
    {
      scope: 'plain',
      settings: {
        foreground: '#D9E6E7', // Default foreground for @accounts
      },
    },
    {
      scope: 'builtin',
      settings: {
        foreground: '#97c39a', // Green for built-in functions
      },
    },
    {
      scope: 'symbol',
      settings: {
        foreground: '#7a78b5', // Purple for symbols
      },
    },
    {
      scope: 'punctuation',
      settings: {
        foreground: '#D9E6E7', // Default foreground
      },
    },
  ],
  name: CODE_THEMES_NAMES['formance-dark'],
  bg: '#01353c',
  fg: '#D9E6E7',
};

export { shikiHighlighter } from './highlighter';
