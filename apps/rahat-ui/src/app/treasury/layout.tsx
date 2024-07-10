'use client';
import * as React from 'react';
import DashboardLayout from '../dashboard/layout';
import TreasuryLayout from '../../sections/treasury/treasury.layout';
import { useTreasuryNavItems } from '../../sections/treasury/useNavItems';
import { useSecondPanel } from '../../providers/second-panel-provider';
import { RPSubgraphProvider, useSettingsStore } from '@rahat-ui/query';
import { Client, cacheExchange, fetchExchange } from '@urql/core';

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = useTreasuryNavItems();
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
      <DashboardLayout>
        <title>Treasury</title>
        <TreasuryLayout menuItems={menuItems}>
          {secondPanel ? [children, secondPanel] : children}
        </TreasuryLayout>
      </DashboardLayout>
    </RPSubgraphProvider>
  );
}
