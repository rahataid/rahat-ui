'use client';

import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { useSecondPanel } from 'apps/rahat-ui/src/providers/second-panel-provider';
import AASettingsTable from './settings.table';
import AAAddSetting from './add.settings';

export default function AASettingsView() {
  const t = useTranslations('AA Project');
  const tg = useTranslations('GLOBAL');
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
      <div className="pb-1 flex justify-between items-center space-x-4">
        <Heading title={tg('SETTINGS')} description={t('MANAGE_PROJECT_SETTINGS')} />
        <IconLabelBtn
          Icon={Plus}
          handleClick={handleAddClick}
          name={t('ADD_SETTING')}
          className="px-3 py-2"
        />
      </div>
      <AASettingsTable />
    </div>
  );
}
