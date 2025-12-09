import type { languages } from 'monaco-editor';

const SCHEMA_ENDPOINT_URL = 'https://playground.numscript.com';

const MAIN_SCHEMA_URL = `${SCHEMA_ENDPOINT_URL}/schema.json`;
export const BALANCES_SCHEMA_URL = `${SCHEMA_ENDPOINT_URL}/balances/schema.json`;
const VARIABLES_SCHEMA_URL = `${SCHEMA_ENDPOINT_URL}/variables/schema.json`;
const METADATA_SCHEMA_URL = `${SCHEMA_ENDPOINT_URL}/metadata/schema.json`;

export const ACCOUNT_PATTERN = '^([a-zA-Z0-9_-]+(:[a-zA-Z0-9_-]+)*)$';
export const ASSET_PATTERN = '^([A-Z]+(/[0-9]+)?)$';
export const VARIABLE_PATTERN = '^[a-z_]+$';

export const NUMSCRIPT_TOKENS_DEFINITIONS: languages.IMonarchLanguage = {
  keywords: [
    'send',
    'vars',
    'remaining',
    'to',
    'kept',
    'allowing',
    'unbounded',
    'overdraft',
    'up',
    'max',
    'from',
  ],
  tokenizer: {
    root: [
      // Comments
      [/\/\/[^\n]*/, 'comment'],
      [/\/\*[\s\S]*?\*\//, 'comment'],

      // String matching (e.g., "text" or "[COIN 100]")
      [/"[^"]*"/, 'string'],
      [/\[[A-Z0-9]+(\/\d+)? (\d+|\*)\]/, 'string'],

      // Matching numbers, percentages, fractions
      [/\d+\/\d+/, 'number'],
      [/\d+%/, 'number'],
      [/\d+/, 'number'],

      // Variables (e.g., $variable)
      [/\$[a-zA-Z_][A-Za-z0-9_]*/, 'variable'],

      // Match anything starting with @ and followed by words (e.g., @something or @something:else)
      [/@[\w:]+/, 'plain'], // Matches @ followed by any sequence of words and colons

      // Keywords (e.g., allowing, overdraft, up, to)
      [
        /\b(send|save|vars|remaining|to|kept|allowing|unbounded|overdraft|up|max|from)\b/,
        'keyword',
      ],

      // Properties (e.g., source, destination)
      [/\b(source|destination)\b/, 'property'],

      // Built-in functions (e.g., set_tx_meta, set_account_meta)
      [/\b(set_tx_meta|set_account_meta)\b/, 'builtin'],

      // Symbols and specific identifiers (e.g., account, monetary, @world)
      [/\b(account|monetary|asset|number|string|portion)\b/, 'symbol'],

      // Punctuation (e.g., brackets, parentheses, and assignment operator)
      [/[{}()\\[\]=]/, 'punctuation'],
    ],
  },
};

export const NUMSCRIPT_LANGUAGE_CONFIG: languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

export const NUMSCRIPT_DIAGNOSTICS_OPTIONS = [
  {
    uri: MAIN_SCHEMA_URL,
    fileMatch: ['*'],
    schema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        balances: { $ref: BALANCES_SCHEMA_URL },
        metadata: { $ref: METADATA_SCHEMA_URL },
        variables: { $ref: VARIABLES_SCHEMA_URL },
      },
    },
  },
  {
    uri: BALANCES_SCHEMA_URL,
    schema: {
      type: 'object',
      description: 'The balance for every account',
      additionalProperties: false,
      patternProperties: {
        additionalProperties: false,
        [ACCOUNT_PATTERN]: {
          description: 'The account name',
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            [ASSET_PATTERN]: {
              description: 'Some currency',
              type: 'integer',
            },
          },
        },
      },
    },
  },
  {
    uri: METADATA_SCHEMA_URL,
    schema: {
      type: 'object',
      description: 'The accounts metadata',
      additionalProperties: false,
      patternProperties: {
        additionalProperties: false,
        [ACCOUNT_PATTERN]: {
          description: 'The account name',
          type: 'object',
          additionalProperties: {
            description: "The metadata's key",
            type: 'string',
          },
        },
      },
    },
  },
  {
    uri: VARIABLES_SCHEMA_URL,
    schema: {
      type: 'object',
      description: "The script's variables",
      additionalProperties: false,
      patternProperties: {
        [VARIABLE_PATTERN]: {
          description: "The variable's stringified value",
          type: 'string',
        },
      },
    },
  },
];
