'use client';

import { useState, useMemo } from 'react';
import { IvrFlow } from './ivr.flow.types';
import { IvrFlowApiPayload, IvrFlowOption } from './ivr.flow.types';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Copy, Check } from 'lucide-react';

function buildApiPayload(flow: IvrFlow): IvrFlowApiPayload {
  const mapNode = (node: typeof flow.rootMenu): IvrFlowOption => ({
    digit: parseInt(node.digit || '0') || 0,
    destination: node.destination || '',
    prompt: node.prompt || '',
    hangup: node.hangup || false,
    options: (node.children || []).map(mapNode),
  });

  return {
    main: {
      prompt: flow.rootMenu.prompt || '',
      options: (flow.rootMenu.children || []).map(mapNode),
    },
  };
}

interface JSONPreviewPanelProps {
  flow: IvrFlow;
}

export default function JSONPreviewPanel({ flow }: JSONPreviewPanelProps) {
  const [copied, setCopied] = useState(false);

  const jsonData = useMemo(() => buildApiPayload(flow), [flow]);
  const jsonString = useMemo(
    () => JSON.stringify(jsonData, null, 2),
    [jsonData],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold">IVR Flow JSON</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="flex-1 overflow-auto p-4 text-xs font-mono bg-muted/30">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
}
