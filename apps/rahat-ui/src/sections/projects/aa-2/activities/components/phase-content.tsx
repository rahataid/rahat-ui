'use client';
import React, { useState } from 'react';
import TaskCard from './phase-card';
import { NoResult, SearchInput, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { Expand } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import PhaseCard from './phase-card';
import { useParams, useRouter } from 'next/navigation';

interface Phase {
  id: string;
  source: string;
  status: string;
  leadTime: string;
  phase?: string;
  title: string;
  responsibility: string;
}

interface PhasecontentProps {
  title: string;
  description: string;
  loading: boolean;
  phases: Phase[];
}

export default function PhaseContent({
  title,
  description,
  phases,
  loading,
}: PhasecontentProps) {
  const { id: projectID } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPhases = phases.filter((phase) =>
    phase.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const router = useRouter();

  const handleUpdateStatus = (id: string) => {
    router.push(`/projects/aa/${projectID}/activities/${id}/update-status`);
  };
  return (
    <Card className="flex flex-col rounded-xl h-[80vh] w-full p-0">
      <CardHeader className="flex flex-col justify-between ">
        <div className="flex flex-col space-y-1">
          <CardTitle className="flex flex-row justify-between">
            <p className="text-xl font-medium leading-none">{title}</p>
            <Expand
              role="button"
              className="w-5 h-5 cursor-pointer hover:shadow-md active:scale-95 focus:ring-2 focus:ring-blue-500 transition-transform"
              onClick={() => {
                router.push(
                  `/projects/aa/${projectID}/activities/list/${title.toLowerCase()}`,
                );
              }}
            />
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <SearchInput
          className="w-full"
          name={title.toLowerCase()}
          onSearch={(e) => setSearchQuery(e.target.value)}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-y-scroll overflow-x-hidden scrollbar-hidden ">
        {loading ? (
          <SpinnerLoader />
        ) : filteredPhases?.length > 0 ? (
          filteredPhases.map((phase, index) => (
            <PhaseCard
              key={index}
              id={phase.id}
              title={phase?.title}
              location={phase.source}
              responsibility={phase.responsibility}
              onUpdateStatus={() => handleUpdateStatus(phase.id)}
              status={phase.status}
              leadTime={phase.leadTime}
              className={`${
                (phase.phase === 'PREPAREDNESS' && 'border-green-500') ||
                (phase.phase === 'READINESS' && 'border-yellow-500') ||
                (phase.phase === 'ACTIVATION' && 'border-red-500')
              } shadow-sm rounded-xl p-0`}
            />
          ))
        ) : (
          <NoResult />
        )}
      </CardContent>
    </Card>
  );
}
