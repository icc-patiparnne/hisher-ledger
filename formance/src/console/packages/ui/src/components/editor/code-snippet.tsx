'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button, cn } from '@platform/ui';
import { copyToClipboard } from '@platform/utils';
import { shikiHighlighter } from './shiki/highlighter';
import { CODE_THEMES_NAMES, TCodeEditorLang } from './shiki/shiki';

const codeVariants = cva(
  'rounded-lg overflow-hidden not-prose [&>pre]:overflow-x-scroll [&>pre]:[scrollbar-width:none] [&>pre::-webkit-scrollbar]:hidden',
  {
    variants: {
      canCopy: {
        true: 'cursor-copy',
      },
      size: {
        sm: 'text-sm [&>pre]:p-3',
        md: 'text-base [&>pre]:p-4',
        lg: 'text-lg [&>pre]:p-6',
      },
      isDark: {
        true: '',
        false: 'border border-border',
      },
    },
    defaultVariants: {
      size: 'sm',
      canCopy: true,
    },
  }
);

export type TCodeSnippetProps = {
  code: string;
  language?: TCodeEditorLang;
  isDark?: boolean;
  isSingleLine?: boolean;
  showLineNumbers?: boolean;
} & VariantProps<typeof codeVariants>;

function CodeSnippet({
  code,
  language = 'typescript',
  canCopy = true,
  isDark = true,
  isSingleLine = true,
  showLineNumbers = true,
  size,
  ...props
}: TCodeSnippetProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const handleCopy = () => {
    if (!canCopy) return;

    copyToClipboard(code.trim());
    toast.success('Copied to clipboard');
  };

  useEffect(() => {
    async function highlight() {
      if (!code) {
        setHighlightedHtml('<pre><code></code></pre>');

        return;
      }

      try {
        const highlighter = await shikiHighlighter.getHighlighter();

        const themeName = isDark
          ? CODE_THEMES_NAMES['formance-dark']
          : CODE_THEMES_NAMES['formance-light'];

        const html = await highlighter.codeToHtml(code, {
          lang: language,
          theme: themeName,
          transformers: showLineNumbers
            ? [
                {
                  name: 'line-numbers',
                  line(node, line) {
                    node.properties['data-line'] = line;
                    node.children.unshift({
                      type: 'element',
                      tagName: 'span',
                      properties: {
                        class: 'line-number',
                        style:
                          'color: #6b7280; margin-right: 1rem; user-select: none; display: inline-block; width: 2em; text-align: right;',
                      },
                      children: [{ type: 'text', value: String(line) }],
                    });
                  },
                },
              ]
            : [],
        });

        setHighlightedHtml(html);
      } catch (error) {
        // LINT_EXCEPTION_REASON: Error logging for debugging syntax highlighting failures
        // eslint-disable-next-line no-console
        console.error('Failed to highlight code:', error);
        setHighlightedHtml(`<pre><code>${code}</code></pre>`);
      }
    }
    highlight();
  }, [code, language, isDark, showLineNumbers]);

  // SSR fallback: render plain code if not hydrated yet
  return (
    <div
      className={cn('group/code relative', { dark: isDark })}
      onClick={handleCopy}
    >
      <div>
        {highlightedHtml ? (
          <div
            className={codeVariants({
              size,
              canCopy,
              isDark,
            })}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            {...props}
          />
        ) : (
          <div
            {...props}
            className={codeVariants({
              size,
              canCopy,
              isDark,
            })}
          >
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
      {canCopy && (
        <Button
          className={cn(
            'absolute',
            isSingleLine
              ? 'top-1/2 -translate-y-1/2 right-3 group-hover/code:opacity-100 opacity-0'
              : 'top-3 right-3'
          )}
          size="icon-md"
          variant="slate"
          onClick={handleCopy}
        >
          <Copy />
        </Button>
      )}
    </div>
  );
}

export { CodeSnippet };
