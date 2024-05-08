'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import C2CSubgraphProvider from '@rahataid/c2c-query/src/subgraph/subgraph.provider';
import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { ProjectLayout } from 'apps/rahat-ui/src/sections/projects/components';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const uuid = useParams().id as UUID;
  useProjectSubgraphSettings(uuid);

  const subgraphSettings = useProjectSettingsStore(
    (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]?.url,
  );

  const renderChildren = () => {
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };

  return (
    <C2CSubgraphProvider
      subgraphClient={
        new Client({
          url: subgraphSettings || 'http://localhost:8000',
          exchanges: [cacheExchange, fetchExchange],
        })
      }
    >
      <ProjectLayout projectType="C2C">{renderChildren()}</ProjectLayout>
    </C2CSubgraphProvider>
  );
}
