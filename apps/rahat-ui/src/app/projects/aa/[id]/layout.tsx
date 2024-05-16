'use client';

import * as React from 'react';
import { ProjectLayout } from '../../../../sections/projects/components';
import { ProjectTypes } from '@rahataid/sdk/enums';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { PROJECT_SETTINGS_KEYS, useAAProjectSettingsDatasource, useProjectSettingsStore } from '@rahat-ui/query';

export default function ProjectLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const { secondPanel } = useSecondPanel();

  const uuid = useParams().id as UUID;
  useAAProjectSettingsDatasource(uuid);

  // const dataSources = useProjectSettingsStore(
  //   (s) => s.settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.DATASOURCE]);

  const renderChildren = () => {
    if (secondPanel) {
      return [children, secondPanel];
    }

    return children;
  };
  return (
    <ProjectLayout projectType={ProjectTypes.ANTICIPATORY_ACTION}>
      {renderChildren()}
    </ProjectLayout>
  );
}
