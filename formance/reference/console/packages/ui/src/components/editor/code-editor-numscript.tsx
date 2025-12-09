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
import {
  NUMSCRIPT_DIAGNOSTICS_OPTIONS,
  NUMSCRIPT_LANGUAGE_CONFIG,
  NUMSCRIPT_TOKENS_DEFINITIONS,
} from './numscript';
import { shikiHighlighter } from './shiki/highlighter';
import { CODE_THEMES_NAMES } from './shiki/shiki';

type CodeEditorNumscriptProps = TCodeEditorProps;

const CodeEditorNumscript: React.FC<CodeEditorNumscriptProps> = ({
  value,
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

        // Register only numscript language (this editor is specifically for numscript)
        monaco.languages.register({ id: 'numscript' });
        monaco.languages.setMonarchTokensProvider(
          'numscript',
          NUMSCRIPT_TOKENS_DEFINITIONS
        );
        monaco.languages.setLanguageConfiguration(
          'numscript',
          NUMSCRIPT_LANGUAGE_CONFIG
        );

        // Integrate Shiki themes with Monaco (includes numscript token colors)
        shikiToMonaco(highlighter, monaco);

        // Set up JSON diagnostics for when numscript is used with JSON
        // Note: JSON language support is not available in monaco-editor-core by default
        // This was used in the original @monaco-editor/react implementation but is optional
        try {
          if (monaco.languages.json?.jsonDefaults) {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              schemas: NUMSCRIPT_DIAGNOSTICS_OPTIONS,
            });
          }
        } catch (error) {
          // JSON language support not available in monaco-editor-core
          // This is expected and doesn't affect numscript functionality
          // LINT_EXCEPTION_REASON: Debug logging for optional JSON diagnostics feature
          // eslint-disable-next-line no-console
          console.debug('JSON diagnostics not available in monaco-editor-core');
        }

        if (editorRef.current && !disposed) {
          const editor = monaco.editor.create(editorRef.current, {
            value,
            language: 'numscript',
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

  if (!isClient) return null;

  return (
    <EditorContainer
      editorRef={editorRef}
      language="numscript"
      height={height}
      adaptiveHeight={adaptiveHeight}
      withBorders={withBorders}
      isEmpty={isEmpty}
      className={className}
      {...props}
    />
  );
};

export { CodeEditorNumscript };
