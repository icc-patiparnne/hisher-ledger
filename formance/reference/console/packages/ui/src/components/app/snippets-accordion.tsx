import { TCodeProps, TModule } from '@platform/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion';
import { Badge } from '../badge';
import { CodeSnippet } from '../editor/code-snippet';

export type TSnippet = {
  title: string;
  snippet: Pick<TCodeProps, 'language' | 'showLineNumbers' | 'code'>;
  version?: string;
  module?: TModule;
};

type TSnippetsAccordionProps = {
  snippets: TSnippet[];
  defaultOpen?: boolean;
  defaultValues?: string[];
};

export const SnippetsAccordion = ({
  snippets,
  defaultOpen,
  defaultValues,
}: TSnippetsAccordionProps) => (
  <Accordion
    type="multiple"
    className="w-full"
    defaultValue={defaultOpen ? defaultValues : undefined}
  >
    {snippets.map((item) => (
      <AccordionItem key={item.title} value={item.title}>
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            {item.title}
            {item.version && <Badge variant="secondary">v{item.version}</Badge>}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <CodeSnippet {...item.snippet} isSingleLine />
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);
