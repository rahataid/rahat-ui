'use client';

import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';
import { ProjectTypes } from '@rahataid/sdk/enums';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  PROJECT_SETTINGS_KEYS,
  useAAProjectSettingsDatasource,
  useAAProjectSettingsHazardType,
  useEntities,
  useProjectContractSettings,
  useProjectSettingsStore,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import GarphQlProvider from 'libs/query/src/lib/aa/graph/graphql-query-client';
import { useProjectChainSettings } from '../../../../../../../libs/query/src/lib/projects/projects.service';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const uuid = useParams().id as UUID;
  // useAAProjectSettingsDatasource(uuid);
  // useProjectContractSettings(uuid);
  // useAAProjectSettingsHazardType(uuid);
  // useProjectSubgraphSettings(uuid);
  useEntities(uuid);
  useProjectChainSettings(uuid);

  // const dataSources = useProjectSettingsStore(
  //   (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.DATASOURCE]);

  const renderChildren = () => {
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };
  return (
    // <GarphQlProvider>
    <ProjectLayout projectType={ProjectTypes.ANTICIPATORY_ACTION}>
      {renderChildren()}
    </ProjectLayout>
    // </GarphQlProvider>
  );
}
