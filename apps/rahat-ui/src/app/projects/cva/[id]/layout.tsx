'use client';

import { ProjectTypes } from '@rahataid/sdk/enums';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
  CVASubgraphProvider,
} from '@rahat-ui/query';
import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

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
    <CVASubgraphProvider
      subgraphClient={
        new Client({
          url: subgraphSettings || 'http://localhost:8000',
          exchanges: [cacheExchange, fetchExchange],
        })
      }
    >
      <ProjectLayout projectType={ProjectTypes.CVA}>
        {secondPanel ? [children, secondPanel] : children}
      </ProjectLayout>
    </CVASubgraphProvider>
  );
}
