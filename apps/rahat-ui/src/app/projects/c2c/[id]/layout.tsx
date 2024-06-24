'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
  useTransactionDetails,
} from '@rahat-ui/query';
// import { useProjectDetails as useProjectSubgraphDetails } from '@rahat-ui/query';
import { C2CSubgraphProvider } from '@rahat-ui/query';
import { Client, cacheExchange, fetchExchange, useQuery } from 'urql';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { ProjectLayout } from 'apps/rahat-ui/src/sections/projects/components';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { ProjectTypes } from '@rahataid/sdk/enums';

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
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  // useProjectSubgraphDetails(contractSettings?.rahattoken?.address);

  // useTransactionDetails();

  // useGetTreasurySourcesSettings(uuid);

  const renderChildren = () => {
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };

  return (
    <C2CSubgraphProvider>
      <ProjectLayout projectType={ProjectTypes.C2C}>
        {renderChildren()}
      </ProjectLayout>
    </C2CSubgraphProvider>
  );
}
