'use client';

import * as React from 'react';
import { ProjectLayout } from 'apps/rahat-ui/src/sections/projects/components';

import { ProjectTypes } from '@rahataid/sdk/enums';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import {
  useAAProjectSettingsDatasource,
  useAAProjectSettingsHazardType,
  useProjectContractSettings,
  useProjectSubgraphSettings,
} from '@rahat-ui/query';
import GarphQlProvider from 'libs/query/src/lib/aa/graph/graphql-query-client';

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

  const renderChildren = () => {
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };
  return (
    <GarphQlProvider>
      <ProjectLayout projectType={'el-kenya'}>{renderChildren()}</ProjectLayout>
    </GarphQlProvider>
  );
}
