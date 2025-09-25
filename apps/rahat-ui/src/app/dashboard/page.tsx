'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@rumsan/react-query';
import { useProjectList, useChainSettings } from '@rahat-ui/query';
import DashboardMain from '../../sections/dashboard/dashboard.main.temp';

export default function DashBoardPage() {
  const router = useRouter();
  const { user } = useUserStore((state) => ({ user: state.user }));
  const { data: projects, isLoading } = useProjectList();
  const [redirecting, setRedirecting] = useState(false);

  const isAidLinkProjectManager = user?.data?.roles?.includes(
    'AidLinkProjectManager',
  );

  useEffect(() => {
    if (!isAidLinkProjectManager || !projects?.data) return;

    const aidlinkProject = projects.data.find(
      (p) => p.type?.toLowerCase() === 'aidlink',
    );

    if (aidlinkProject?.uuid) {
      setRedirecting(true);
      router.replace(`/projects/aidlink/${aidlinkProject.uuid}`);
    }
  }, [isAidLinkProjectManager, projects, router]);

  useChainSettings();

  if (isLoading || redirecting) return null;

  return <DashboardMain />;
}
