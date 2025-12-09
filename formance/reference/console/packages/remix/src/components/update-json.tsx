import { useEffect, useState } from 'react';

import { Button, CodeEditor } from '@platform/ui';

import { useAction } from '../hooks/use-action';

interface UpdateJsonProps {
  initialJson: Record<string, unknown>;
  onUpdate?: (json: Record<string, unknown>) => void;
  actionUrl: string;
  formAction: string;
  formFields: Record<string, unknown>;
}

export function UpdateJson({
  initialJson,
  onUpdate,
  actionUrl,
  formAction,
  formFields,
}: UpdateJsonProps) {
  const [json, setJson] = useState<Record<string, unknown>>(initialJson || {});
  const [isValid, setIsValid] = useState(true);

  const { submit, isSubmitting } = useAction({
    actionUrl,
    formAction,
    onSuccess: (data) => {
      onUpdate?.(data);
    },
  });

  const handleJsonUpdate = (value: string | undefined) => {
    if (!value) {
      setIsValid(false);
      return;
    }

    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      const invalidValues = Object.keys(parsed).filter(
        (key) => typeof parsed[key] !== 'string'
      );
      if (invalidValues.length > 0) {
        setIsValid(false);
      } else {
        setJson(parsed);
        setIsValid(true);
        onUpdate?.(parsed);
      }
    } catch (e) {
      setIsValid(false);
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    await submit({
      json,
      initialJson,
      ...formFields,
    });
  };

  // Update internal state when initialJson changes
  useEffect(() => {
    setJson(initialJson || {});
  }, [initialJson]);

  return (
    <div className="space-y-4">
      <CodeEditor
        value={JSON.stringify(json, null, 2)}
        language="json"
        onChange={handleJsonUpdate}
      />
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </Button>
      </div>
    </div>
  );
}
