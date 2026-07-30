'use client';
import * as React from 'react';
import DASHBOARDLayout from '../dashboard/layout';
import TREASURYLayout from '../../sections/treasury/treasury.layout';
import { useTREASURYNavItems } from '../../sections/treasury/useNavItems';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { RPSubgraphProvider, useSettingsStore } from '@rahat-ui/query';
import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { useTranslations } from 'next-intl';

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('TREASURY');
  const menuItems = useTREASURYNavItems();
  const { secondPanel } = useSecondPanel();
  const subGraphURL = useSettingsStore((state) => state.subGraphUrl);
  return (
    <RPSubgraphProvider
      subgraphClient={
        new Client({
          url: subGraphURL || 'http://localhost:8000/subgraphs/name/rahat/rp/',
          exchanges: [cacheExchange, fetchExchange],
        })
      }
    >
      <DASHBOARDLayout>
        <title>{t('TREASURY')}</title>
        <TREASURYLayout menuItems={menuItems}>
          {secondPanel ? [children, secondPanel] : children}
        </TREASURYLayout>
      </DASHBOARDLayout>
    </RPSubgraphProvider>
  );
}
