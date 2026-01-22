import {
  PROJECT_SETTINGS_KEYS,
  useAllGlofasProbFlood,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import GlofasInfoCard from './glofas.info.card';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import React from 'react';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { NoResult, TableLoader } from 'apps/rahat-ui/src/common';
import Link from 'next/link';

export function GlofasSection() {
  const params = useParams();
  const projectId = params.id as UUID;

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const { data, isLoading, error } = useAllGlofasProbFlood(projectId, {
    riverBasin:
      settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
        'river_basin'
      ],
    page: 1,
    perPage: 9999,
  });

  if (isLoading) {
    return <TableLoader />;
  }

  if (!data || error) {
    return (
      <div className="p-4">
        <NoResult message="No GLOFAS Data" />
      </div>
    );
  }
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="flex flex-col gap-4">
        {data?.map((item: any) => {
          return (
            <Link
              href={`/projects/aa/${projectId}/data-sources/glofas-details/${item?.info?.returnPeriod}`}
              key={item.id}
            >
              <GlofasInfoCard glofas={item} />
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}
