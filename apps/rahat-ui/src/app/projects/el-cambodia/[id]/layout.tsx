'use client';

import * as React from 'react';
import { ProjectLayout } from 'apps/rahat-ui/src/sections/projects/components';

import { ProjectTypes } from '@rahataid/sdk/enums';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  PROJECT_SETTINGS_KEYS,
  useAAProjectSettingsDatasource,
  useAAProjectSettingsHazardType,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import { CambodiaSubgraphProvider } from '@rahat-ui/query';
import { cacheExchange, Client, fetchExchange } from '@urql/core';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const uuid = useParams().id as UUID;
  useAAProjectSettingsDatasource(uuid);
  useProjectContractSettings(uuid);
  useAAProjectSettingsHazardType(uuid);
  useProjectSubgraphSettings(uuid);

  const subgraphSettings = useProjectSettingsStore(
    (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]?.url,
  );
  console.log(subgraphSettings);

  const renderChildren = () => {
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };
  return (
    <CambodiaSubgraphProvider
      subgraphClient={
        new Client({
          url:
            subgraphSettings ||
            'http://localhost:8000/subgraphs/name/rahat/Cambodia/',
          exchanges: [cacheExchange, fetchExchange],
        })
      }
    >
      <ProjectLayout projectType={'el-cambodia'}>
        {renderChildren()}
      </ProjectLayout>
    </CambodiaSubgraphProvider>
  );
}
