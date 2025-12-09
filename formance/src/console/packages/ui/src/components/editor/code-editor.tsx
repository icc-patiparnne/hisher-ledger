import React from 'react';
import { CodeEditorNumscript } from './code-editor-numscript';
import { CodeEditorShiki } from './code-editor-shiki';
import { TCodeEditorLang } from './shiki/shiki';

export type TCodeEditorProps = {
  value: string;
  defaultValue?: string;
  language?: TCodeEditorLang | 'numscript';
  isDark?: boolean;
  onChange?: (value: string) => void;
  height?: number | string;
  isReadonly?: boolean;
  onCtrlEnter?: VoidFunction;
  adaptiveHeight?: boolean;
  defaultUnfoldAll?: boolean;
  withBorders?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

const CodeEditor: React.FC<TCodeEditorProps> = ({
  value,
  defaultValue,
  language = 'typescript',
  isDark = true,
  onChange,
  height = 400,
  isReadonly = false,
  onCtrlEnter,
  adaptiveHeight = true,
  defaultUnfoldAll = true,
  withBorders = true,
  ...props
}) => {
  // If language is numscript, use the specialized numscript editor
  if (language === 'numscript') {
    return (
      <CodeEditorNumscript
        value={value ?? defaultValue}
        isDark={isDark}
        onChange={onChange}
        height={height}
        isReadonly={isReadonly}
        onCtrlEnter={onCtrlEnter}
        adaptiveHeight={adaptiveHeight}
        defaultUnfoldAll={defaultUnfoldAll}
        withBorders={withBorders}
        {...props}
      />
    );
  }

  return (
    <CodeEditorShiki
      value={value ?? defaultValue}
      language={language as TCodeEditorLang}
      isDark={isDark}
      onChange={onChange}
      height={height}
      isReadonly={isReadonly}
      onCtrlEnter={onCtrlEnter}
      adaptiveHeight={adaptiveHeight}
      defaultUnfoldAll={defaultUnfoldAll}
      withBorders={withBorders}
      {...props}
    />
  );
};

export { CodeEditor };
