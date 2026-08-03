'use client';

import { useState, useMemo } from 'react';
import { IvrFlow } from '../types/ivr.flow.types';
import { buildApiPayload } from '../utils/utils';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface JSONPreviewPanelProps {
  flow: IvrFlow;
}

export default function JSONPreviewPanel({ flow }: JSONPreviewPanelProps) {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
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
    <div className="flex flex-col h-full gap-3 p-3 md:p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[clamp(13px,1.2vw,16px)]">{t('IVR_FLOW_JSON')}</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="gap-2 rounded-sm h-[clamp(28px,2.5vw,36px)] text-[clamp(12px,1vw,14px)]"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? tg('COPIED_CAP') : tg('COPY')}
        </Button>
      </div>
      <div className="flex-1 overflow-hidden rounded-sm border">
        <pre className="h-full overflow-auto p-4 text-xs font-mono bg-card">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
}
