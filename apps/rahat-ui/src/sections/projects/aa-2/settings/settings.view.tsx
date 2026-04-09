'use client';

import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import AASettingsTable from './settings.table';
import AAAddSetting from './add.settings';

export default function AASettingsView() {
  const { id } = useParams();
  const projectUUID = id as UUID;
  const { setSecondPanelComponent, closeSecondPanel } = useSecondPanel();

  const handleAddClick = () => {
    setSecondPanelComponent(
      <AAAddSetting
        projectUUID={projectUUID}
        closeSecondPanel={closeSecondPanel}
      />,
    );
  };

  return (
    <div>
      <div className="p-4 pb-2 flex justify-between items-center space-x-4">
        <Heading
          title="Settings"
          description="Manage project settings"
        />
        <IconLabelBtn
          Icon={Plus}
          handleClick={handleAddClick}
          name="Add Setting"
          className="px-3 py-2"
        />
      </div>
      <AASettingsTable />
    </div>
  );
}
