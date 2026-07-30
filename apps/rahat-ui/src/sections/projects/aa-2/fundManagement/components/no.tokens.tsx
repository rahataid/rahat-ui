import React from 'react';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NoTokens() {
  const t = useTranslations('AA_PROJECT');
  return (
    <div className="p-4 border rounded-md flex flex-col space-y-2 items-center">
      <div className="p-4 rounded-full bg-red-50">
        <Info color="red" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-xl/6">{t('NOT_ENOUGH_TOKENS')}</p>
        <p className="text-sm/6 text-muted-foreground">
          {t('THERE_ARE_NOT_ENOUGH_TOKENS')}
        </p>
      </div>
    </div>
  );
}
