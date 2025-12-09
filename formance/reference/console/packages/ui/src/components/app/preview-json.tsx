import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { copyToClipboard } from '@platform/utils';

import { cn } from '../../lib/utils';
import { Button } from '../button';
import { CodeEditor, TCodeEditorProps } from '../editor/code-editor';

type TPreviewJsonProps = {
  json: Record<string, unknown>;
} & Omit<TCodeEditorProps, 'value'>;

const PreviewJson = ({
  json,
  isDark = true,
  adaptiveHeight = true,
  defaultUnfoldAll = true,
  ...props
}: TPreviewJsonProps) => (
  <div className={cn('group/previewJson relative', props.className)}>
    <CodeEditor
      value={JSON.stringify(json, null, 2)}
      isDark={isDark}
      language="json"
      isReadonly
      adaptiveHeight={adaptiveHeight}
      defaultUnfoldAll={defaultUnfoldAll}
    />

    <div className="flex justify-end mb-2 absolute right-3 top-3 gap-2 transition-all group-hover/previewJson:opacity-100 opacity-0">
      <Button
        size="icon-sm"
        variant="emerald"
        onClick={() => {
          copyToClipboard(JSON.stringify(json, null, 2));
          toast.success('Copied to clipboard');
        }}
      >
        <Copy />
      </Button>
    </div>
  </div>
);

export { PreviewJson };
