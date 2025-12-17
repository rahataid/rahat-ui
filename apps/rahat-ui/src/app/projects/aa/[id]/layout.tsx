'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useAAProjectSettingsContract,
  useAAProjectSettingsDatasource,
  useAAProjectSettingsHazardType,
  useEntities,
  useProjectChainSettings,
  useProjectContractSettings,
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
  useEntities(uuid, PROJECT_SETTINGS_KEYS.ENTITIES);
  useAAProjectSettingsDatasource(uuid);
  useProjectContractSettings(uuid);
  useAAProjectSettingsHazardType(uuid);
  useProjectSubgraphSettings(uuid);
  useAAProjectSettingsContract(uuid);
  useEntities(uuid, PROJECT_SETTINGS_KEYS.INKIND_ENTITIES);
  // useAAProjectSettingsDatasource(uuid);
  // useProjectContractSettings(uuid);
  // useAAProjectSettingsHazardType(uuid);
  // useProjectSubgraphSettings(uuid);
  useProjectChainSettings(uuid);

  // const dataSources = useProjectSettingsStore(
  //   (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.DATASOURCE]);

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
