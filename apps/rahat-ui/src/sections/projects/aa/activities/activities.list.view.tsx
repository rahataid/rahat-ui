'use client';

import { useParams } from 'next/navigation';
import ActivitiesTable from './activities.table';
import { useActivities, useActivitiesStore } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function ActivitiesList() {
  const { id } = useParams();
  useActivities(id as UUID);
  const activities = useActivitiesStore((state) => state.activities);

  return <ActivitiesTable activitiesData={activities?.data} />;
}
