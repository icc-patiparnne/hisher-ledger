import React from 'react';
import { cn } from '../../../lib/utils';

type EditorContainerProps = {
  editorRef: React.RefObject<HTMLDivElement | null>;
  language: string;
  height?: number | string;
  adaptiveHeight?: boolean;
  withBorders?: boolean;
  isEmpty?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Shared container component for both Monaco editors
 */
export const EditorContainer: React.FC<EditorContainerProps> = ({
  editorRef,
  language,
  height,
  adaptiveHeight,
  withBorders,
  isEmpty,
  className,
  ...props
}) => (
  <div
    ref={editorRef}
    data-lang={language}
    data-editor-container
    style={{
      height: adaptiveHeight
        ? 'auto'
        : typeof height === 'number'
        ? `${height}px`
        : `${height}`,
    }}
    className={cn(
      'w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      {
        'overflow-hidden': adaptiveHeight,
        'overflow-auto': !adaptiveHeight,
        'rounded-lg border border-input': withBorders,
        'p-0 h-full ring-offset-background': isEmpty,
      },
      className
    )}
    {...props}
  />
);
