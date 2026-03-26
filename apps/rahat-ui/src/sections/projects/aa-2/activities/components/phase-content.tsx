'use client';
import React, { useState } from 'react';
import { NoResult, SearchInput, SpinnerLoader } from 'apps/rahat-ui/src/common';
import { Expand } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import PhaseCard from './phase-card';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PhaseContentProps } from 'apps/rahat-ui/src/types/activities';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

export default function PhaseContent({
  title,
  description,
  phases,
  loading,
  isPinned = false,
  onTogglePin,
}: PhaseContentProps) {
  const { id: projectID } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPhases = phases.filter((phase) =>
    phase.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const router = useRouter();

  const lowerTitle = title.toLowerCase();

  const handleUpdateStatus = (id: string) => {
    router.push(`/projects/aa/${projectID}/activities/${id}/update-status`);
  };
  return (
    <Card className="flex flex-col rounded-xl h-[calc(100vh-180px)] w-full p-0">
      <CardHeader className="flex flex-col justify-between ">
        <div className="flex flex-col space-y-1">
          <CardTitle className="flex flex-row justify-between ">
            <p className="text-xl font-medium leading-none">{title}</p>
            <div className="flex items-center gap-2">
              {onTogglePin &&
                (isPinned ? (
                  <Button
                    onClick={onTogglePin}
                    variant={'secondary'}
                    className="p-0 bg-transparent w-6 h-6"
                  >
                    <Image
                      src="/svg/pin-on.svg"
                      alt="Unpin phase"
                      title="Unpin phase"
                      className="w-5 h-5 cursor-pointer active:scale-95 transition-transform"
                      width={25}
                      height={25}
                    />
                  </Button>
                ) : (
                  <Button
                    onClick={onTogglePin}
                    variant={'secondary'}
                    className="p-0 bg-transparent w-6 h-6"
                  >
                    <Image
                      src="/svg/pin-off.svg"
                      alt="Pin phase to front"
                      title="Pin phase to front"
                      className="w-5 h-5  cursor-pointer active:scale-95 transition-transform"
                      width={25}
                      height={25}
                    />
                  </Button>
                ))}
              <Expand
                role="button"
                className="w-5 h-5 cursor-pointer hover:shadow-md active:scale-95 focus:ring-2 focus:ring-blue-500 transition-transform"
                onClick={() => {
                  router.push(
                    `/projects/aa/${projectID}/activities/list/${lowerTitle}`,
                  );
                }}
              />
            </div>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <SearchInput
          className="w-full"
          name={title.toLowerCase()}
          onSearch={(e) => setSearchQuery(e.target.value)}
        />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-hidden ">
        {loading ? (
          <SpinnerLoader />
        ) : filteredPhases?.length > 0 ? (
          <div className="flex flex-1 flex-col gap-2">
            {filteredPhases.map((phase, index) => (
              <PhaseCard
                key={index}
                id={phase.id}
                title={phase?.title}
                responsibleStation={phase.responsibleStation}
                responsibility={phase.responsibility}
                onUpdateStatus={() => handleUpdateStatus(phase.id)}
                status={phase.status}
                leadTime={phase.leadTime}
                className={`${
                  (phase.phase === 'PREPAREDNESS' && 'border-green-500') ||
                  (phase.phase === 'READINESS' && 'border-yellow-500') ||
                  (phase.phase === 'ACTIVATION' && 'border-red-500')
                } shadow-sm rounded-xl p-0 hover:cursor-pointer hover:bg-gray-100`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center ">
            <NoResult message="No Activities Available" className="mt-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
