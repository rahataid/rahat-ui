'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ActivitiesTable from './activities.table';
import { useActivities, useActivitiesStore } from '@rahat-ui/query';
import { UUID } from 'crypto';
import { QueryClient } from '@rahat-ui/query';

export default function ActivitiesList() {
  const q = new QueryClient()
  const { id } = useParams();
  const [filterItem, setFilterItem] = useState({});

  const filter = useCallback((category: UUID) => {
    const payload = { category: category }
    setFilterItem(payload);
    console.log('payload:', payload)
  }, [])

  useActivities(id as UUID, filterItem);
  const activities = useActivitiesStore((state) => state.activities);
  // useEffect(() => {
  //   q.invalidateQueries
  //   // useActivities(id as UUID, filterItem)
  // }, [filterItem])

  return <ActivitiesTable activitiesData={activities?.data} filter={filter} />;
}
