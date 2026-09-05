'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useTranslations } from 'next-intl';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useProject } from '@rahat-ui/query';
import { Heading } from 'apps/rahat-ui/src/common';
import ProjectInfoForm from './editProject';
import { AASettingsView } from './aa-2/settings';

export default function ProjectInfoView() {
  const t = useTranslations('GLOBAL');
  const { id } = useParams();
  const projectUUID = id as UUID;
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'projectInfo';

  const { data } = useProject(projectUUID);
  const project = data?.data;
  const isAAProject =
    project?.type?.toUpperCase()?.toLowerCase() === 'aa' ||
    project?.extras?.REDIRECT_TO?.toLowerCase() === 'aa';

  return (
    <div className="p-4">
      <Heading
        title={project?.name || t('PROJECT')}
        description={project?.description || ''}
        backBtn
      />
      <Tabs defaultValue={tab}>
        <TabsList className="border bg-secondary rounded">
          <TabsTrigger
            className="w-full data-[state=active]:bg-white"
            value="projectInfo"
          >
            {t('PROJECT_INFO')}
          </TabsTrigger>
          {isAAProject && (
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="projectSetting"
            >
              {t('PROJECT_SETTING')}
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="projectInfo">
          <ProjectInfoForm />
        </TabsContent>
        {isAAProject && (
          <TabsContent value="projectSetting">
            <AASettingsView />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
