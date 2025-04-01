'use client';
import React, { useState } from 'react';
import TaskCard from './phase-card';
import { SearchInput } from 'apps/rahat-ui/src/common';
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

interface Phase {
  description: string;
  location: string;
  userName: string;
  status: string;
  leadTime: string;
  phase?: string;
  title: string | undefined;
}

interface PhasecontentProps {
  title: string;
  description: string;
  phases: Phase[];
}

export default function PhaseContent({
  title,
  description,
  phases,
}: PhasecontentProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPhases = phases.filter((phase) =>
    phase.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="flex flex-col rounded-xl h-[80vh] w-full p-0">
      <CardHeader className="flex flex-col justify-between ">
        <div className="flex flex-col space-y-1">
          <CardTitle className="flex flex-row justify-between">
            <p className="text-xl font-medium leading-none">{title}</p>
            <Expand className="w-5 h-5" />
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <SearchInput
          className="w-full"
          name={title.toLowerCase()}
          onSearch={(e) => setSearchQuery(e.target.value)}
        />
      </CardHeader>
      <ScrollArea className="h-[70vh]">
        <CardContent className="flex flex-col gap-2">
          {filteredPhases.map((phase, index) => (
            <PhaseCard
              key={index}
              description={phase.description}
              location={phase.location}
              userName={phase.userName}
              onUpdateStatus={() => {}}
              status={phase.status}
              leadTime={phase.leadTime}
              className={`${
                (phase.phase === 'PREPAREDNESS' && 'border-green-500') ||
                (phase.phase === 'READINESS' && 'border-yellow-500') ||
                (phase.phase === 'ACTIVATION' && 'border-red-500')
              } shadow-sm rounded-xl h-44`}
            />
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
