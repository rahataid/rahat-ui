'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useAAProjectSettingsContract,
  useEntities,
  useProjectChainSettings,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import { ProjectTypes } from '@rahataid/sdk/enums';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import * as React from 'react';
import GrievancesLayout from '../../../../sections/projects/aa-2/grievances/grievances.layout';
import { ProjectLayout } from '../../../../sections/projects/components';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const uuid = useParams().id as UUID;
  const { isLoading: isContractLoading } = useProjectContractSettings(uuid);
  const { isLoading: isSubgraphLoading } = useProjectSubgraphSettings(uuid);
  const { isLoading: isAAContractLoading } = useAAProjectSettingsContract(uuid);
  useProjectChainSettings(uuid);

  const settings = useProjectSettingsStore((s) => s.settings);

  // Check if critical settings are already in the store (from localStorage)
  const hasSettingsInStore =
    !!settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.CONTRACT] ||
    !!settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.DATASOURCE];

  const isSettingsLoading =
    !hasSettingsInStore &&
    (
      isContractLoading ||
      isSubgraphLoading ||
      isAAContractLoading);

  // const dataSources = useProjectSettingsStore(
  //   (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.DATASOURCE]);

  if (isSettingsLoading) {
    return (
      <ProjectLayout projectType={ProjectTypes.ANTICIPATORY_ACTION}>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-65px)] gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">
            Loading project settings...
          </p>
        </div>
      </ProjectLayout>
    );
  }

  return (
    // <GarphQlProvider>
    <ProjectLayout projectType={ProjectTypes.ANTICIPATORY_ACTION}>
      <GrievancesLayout>
        {secondPanel ? [children, secondPanel] : children}
      </GrievancesLayout>
    </ProjectLayout>
    // </GarphQlProvider>
  );
}
