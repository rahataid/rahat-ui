'use client';

import {
  RPSubgraphProvider,
  PROJECT_SETTINGS_KEYS,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import { ProjectTypes } from '@rahataid/sdk/enums';
import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();
  const uuid = useParams().id as UUID;
  useProjectSubgraphSettings(uuid);
  useProjectContractSettings(uuid);

  const subgraphSettings = useProjectSettingsStore(
    (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]?.url,
  );
  // const contractSettings = useProjectSettingsStore(
  //   (state) => state.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  // );

  return (
    <RPSubgraphProvider
      subgraphClient={
        new Client({
          url: subgraphSettings || 'http://localhost:8000/subgraphs/name/rahat/rp/',
          exchanges: [cacheExchange, fetchExchange],
        })
      }
    >
      <ProjectLayout projectType={ProjectTypes.RP}>
        {secondPanel ? [children, secondPanel] : children}
      </ProjectLayout>
    </RPSubgraphProvider>
  );
}
