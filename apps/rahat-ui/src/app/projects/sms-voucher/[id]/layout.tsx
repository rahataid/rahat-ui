'use client';

import {
  KenyaSubgraphProvider,
  PROJECT_SETTINGS_KEYS,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
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
    <KenyaSubgraphProvider
      subgraphClient={
        new Client({
          url:
            subgraphSettings ||
            'http://localhost:8000/subgraphs/name/rahat/Kenya/',
          exchanges: [cacheExchange, fetchExchange],
        })
      }
    >
      <ProjectLayout projectType={'sms-voucher'}>
        {secondPanel ? [children, secondPanel] : children}
      </ProjectLayout>
    </KenyaSubgraphProvider>
  );
}
