'use client';

import * as React from 'react';
import '../el-village-doctor.css';
import { ProjectLayout } from 'apps/rahat-ui/src/sections/projects/components';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  CambodiaSubgraphProvider,
  PROJECT_SETTINGS_KEYS,
  resolveCambodiaSubgraphUrl,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import { cacheExchange, Client, fetchExchange } from '@urql/core';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const uuid = useParams().id as UUID;
  useProjectContractSettings(uuid);
  useProjectSubgraphSettings(uuid);

  const projectSubgraphUrl = useProjectSettingsStore(
    (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.SUBGRAPH]?.url,
  );

  const resolvedSubgraphUrl = React.useMemo(
    () => resolveCambodiaSubgraphUrl(projectSubgraphUrl),
    [projectSubgraphUrl],
  );

  const subgraphClient = React.useMemo(
    () =>
      new Client({
        url: resolvedSubgraphUrl,
        exchanges: [cacheExchange, fetchExchange],
      }),
    [resolvedSubgraphUrl],
  );

  const renderChildren = () => {
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };
  return (
    <CambodiaSubgraphProvider subgraphClient={subgraphClient}>
      <ProjectLayout projectType={'el-village-doctor'}>
        <div
          className="h-full min-h-0 flex-1 antialiased [--tw-prose-body:var(--muted-foreground)]"
          data-village-doctor="true"
        >
          {renderChildren()}
        </div>
      </ProjectLayout>
    </CambodiaSubgraphProvider>
  );
}
