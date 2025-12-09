import type { editor } from 'monaco-editor-core';
import React from 'react';
import { CTRL_ENTER_EVENT } from './monaco';

/**
 * Creates the updateHeight function for adaptive height editors
 */
export const createUpdateHeightFunction =
  (
    editorRef: React.RefObject<HTMLDivElement | null>,
    editor: editor.IStandaloneCodeEditor
  ) =>
  () => {
    if (!editorRef.current) return;

    const contentHeight = Math.min(1000, editor.getContentHeight());
    editorRef.current.style.height = `${contentHeight}px`;
    editor.layout({
      width: editorRef.current.clientWidth,
      height: contentHeight,
    });
  };

/**
 * Sets up common editor features like Ctrl+Enter command and adaptive height
 */
export const setupEditorFeatures = (
  editor: editor.IStandaloneCodeEditor,
  monaco: typeof import('monaco-editor-core'),
  options: {
    editorRef: React.RefObject<HTMLDivElement | null>;
    defaultUnfoldAll?: boolean;
    adaptiveHeight?: boolean;
    isEmpty?: boolean;
    onChange?: (value: string) => void;
  }
) => {
  const { editorRef, defaultUnfoldAll, adaptiveHeight, isEmpty, onChange } =
    options;

  // Fold all by default unless specified otherwise
  if (!defaultUnfoldAll) {
    editor.getAction('editor.foldAll')?.run();
  }

  // Add Ctrl+Enter command
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    window.dispatchEvent(new CustomEvent(CTRL_ENTER_EVENT));
  });

  // Set up adaptive height
  const updateHeight = createUpdateHeightFunction(editorRef, editor);

  if (adaptiveHeight) {
    editor.onDidContentSizeChange(updateHeight);
  }

  if (!isEmpty) {
    updateHeight();
  }

  // Set up onChange handler
  if (onChange) {
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });
  }

  return { updateHeight };
};

/**
 * Updates editor value
 */
export const updateEditorValue = (
  editor: editor.IStandaloneCodeEditor | null,
  value: string
) => {
  if (!editor) return;

  if (editor.getValue() !== value) {
    editor.setValue(value);
  }
};

/**
 * Updates editor theme
 */
export const updateEditorTheme = async (theme: string) => {
  try {
    const monaco = await import('monaco-editor-core');
    monaco.editor.setTheme(theme);
  } catch (error) {
    // LINT_EXCEPTION_REASON: Error logging for debugging Monaco theme update failures
    // eslint-disable-next-line no-console
    console.error('Failed to update Monaco editor theme:', error);
  }
};

/**
 * Calculates theme name from isDark prop
 */
export const getThemeName = (
  isDark: boolean,
  themeNames: { 'formance-dark': string; 'formance-light': string }
) => (isDark ? themeNames['formance-dark'] : themeNames['formance-light']);
