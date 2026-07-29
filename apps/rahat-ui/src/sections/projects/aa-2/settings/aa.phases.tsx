'use client';

import React from 'react';
import { usePhases, usePhasesStore, useProjectInfo } from '@rahat-ui/query';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DemoTable, Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import SpinnerLoader from '../../components/spinner.loader';
import { useAASettingsPhaseColumns } from './settings.phase.column';

export interface Phase {
  uuid: string;
  name: string;
  canRevert: boolean;
  canTriggerPayout: boolean;
  riverBasin: string;
  isAutomatedActivity: boolean;
  disbursementConfig: {
    disbursementMethods: string[];
  };
}
export default function AAProjectPhasesView() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  usePhases(projectId);
  const phases = usePhasesStore((state) => state.phases);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: projectInfo, isLoading: isProjectLoading } = useProjectInfo(
    projectId as UUID,
  );

  const projectType = projectInfo?.value?.project_type;

  const filteredData = React.useMemo(() => {
    if (!phases?.length) return [];
    if (!searchQuery) return phases;
    return phases.filter((p: Phase) =>
      p?.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );
  }, [phases, searchQuery]);

  const handleAddPhaseClick = () => {
    router.push(
      `/projects/aa/${projectId}/trigger-statements/phase/add?from=update-aa-settings&tab=phases`,
    );
  };
  const handleEditClick = (phase: Phase) => {
    router.push(
      `/projects/aa/${projectId}/trigger-statements/phase/${phase.uuid}/edit?from=update-aa-settings&tab=phases`,
    );
  };

  const table = useReactTable({
    data: filteredData,
    columns: useAASettingsPhaseColumns(handleEditClick, projectType),
    getCoreRowModel: getCoreRowModel(),
  });

  if (isProjectLoading) {
    return (
      <div className="flex items-center justify-center h-full ">
        <SpinnerLoader />;
      </div>
    );
  }
  return (
    <div>
      <div className="pb-1 flex justify-between items-center space-x-4">
        <Heading title="Phases" description="Manage project phases" />
        <IconLabelBtn
          Icon={Plus}
          handleClick={handleAddPhaseClick}
          name="Add Phase"
          className="px-3 py-2"
        />
      </div>
      <div className="space-y-2">
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded"
        />
        <DemoTable table={table} tableHeight="h-[calc(100vh-380px)]" />
      </div>
    </div>
  );
}
