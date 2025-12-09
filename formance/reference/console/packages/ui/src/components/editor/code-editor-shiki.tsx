'use client';

import React, { useEffect, useRef, useState } from 'react';

import { TCodeEditorProps } from './code-editor';
import { EditorContainer } from './monaco/editor-container';
import {
  getThemeName,
  setupEditorFeatures,
  updateEditorTheme,
  updateEditorValue,
} from './monaco/editor-utils';
import {
  CTRL_ENTER_EVENT,
  MONOACO_EDITOR_OPTIONS,
  setupMonacoEnvironment,
} from './monaco/monaco';
import { shikiHighlighter } from './shiki/highlighter';
import { CODE_EDITOR_LANGS, CODE_THEMES_NAMES } from './shiki/shiki';

type CodeEditorShikiProps = TCodeEditorProps;

const CodeEditorShiki: React.FC<CodeEditorShikiProps> = ({
  value,
  language = 'typescript',
  isDark = true,
  onChange,
  height,
  isReadonly,
  onCtrlEnter,
  adaptiveHeight,
  defaultUnfoldAll,
  withBorders,
  className,
  ...props
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const monacoEditorRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  const theme = getThemeName(isDark, CODE_THEMES_NAMES);

  const isEmpty = value === '{}' || value === '';

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (onCtrlEnter === undefined) return;

    window.addEventListener(CTRL_ENTER_EVENT, onCtrlEnter);

    return () => window.removeEventListener(CTRL_ENTER_EVENT, onCtrlEnter);
  }, [onCtrlEnter]);

  useEffect(() => {
    if (!isClient) return;

    let disposed = false;
    let monaco: any;

    async function setupEditor() {
      try {
        // Dynamically import Monaco and Shiki only in browser
        monaco = await import('monaco-editor-core');
        const { shikiToMonaco } = await import('@shikijs/monaco');

        // Configure Monaco environment to avoid web worker warnings
        setupMonacoEnvironment();

        const highlighter = await shikiHighlighter.getHighlighter();

        CODE_EDITOR_LANGS.forEach((lang) => {
          monaco.languages.register({ id: lang });
        });

        shikiToMonaco(highlighter, monaco);

        if (editorRef.current && !disposed) {
          const editor = monaco.editor.create(editorRef.current, {
            value,
            language,
            theme,
            readOnly: isReadonly,
            ...MONOACO_EDITOR_OPTIONS,
          });
          monacoEditorRef.current = editor;

          // Set up common editor features
          setupEditorFeatures(editor, monaco, {
            editorRef,
            defaultUnfoldAll,
            adaptiveHeight,
            isEmpty,
            onChange,
          });
        }
      } catch (error) {
        // LINT_EXCEPTION_REASON: Error logging for debugging Monaco editor setup failures
        // eslint-disable-next-line no-console
        console.error('Failed to setup Monaco editor with Shiki:', error);
      }
    }

    setupEditor();

    return () => {
      disposed = true;
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
        monacoEditorRef.current = null;
      }
    };
    // Only run once on mount but also depend on adaptiveHeight and isEmpty for proper initialization
  }, [isClient, adaptiveHeight, isEmpty]);

  // Update value when it changes
  useEffect(() => {
    const editor = monacoEditorRef.current;
    updateEditorValue(editor, value);
  }, [value]);

  // Update theme when it changes
  useEffect(() => {
    updateEditorTheme(theme);
  }, [theme]);

  // Update language when it changes (Shiki-specific)
  useEffect(() => {
    const editor = monacoEditorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    if (model && model.getLanguageId() !== language) {
      import('monaco-editor-core')
        .then((monaco) => {
          monaco.editor.setModelLanguage(model, language);
        })
        .catch((error) => {
          // LINT_EXCEPTION_REASON: Error logging for debugging Monaco language update failures
          // eslint-disable-next-line no-console
          console.error('Failed to update Monaco editor language:', error);
        });
    }
  }, [language]);

  if (!isClient) return null;

  return (
    <EditorContainer
      editorRef={editorRef}
      language={language}
      height={height}
      adaptiveHeight={adaptiveHeight}
      withBorders={withBorders}
      isEmpty={isEmpty}
      className={className}
      {...props}
    />
  );
};

export { CodeEditorShiki };
