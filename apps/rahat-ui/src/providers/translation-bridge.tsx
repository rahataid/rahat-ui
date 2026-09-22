'use client';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { setTranslate } from '@rahat-ui/community-query';

export default function TranslationBridge() {
  const t = useTranslations('GLOBAL');

  useEffect(() => {
    setTranslate(t);
  }, [t]);

  return null;
}
