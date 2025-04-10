import * as React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  useActivities,
  useActivitiesCategories,
  useActivitiesStore,
  usePagination,
  usePhases,
  usePhasesStore,
} from '@rahat-ui/query';
import useActivitiesTableColumn from './useActivitiesTableColumn';
import ActivitiesTable from './activities.table';

import { UUID } from 'crypto';
import ActivitiesTableFilters from './activities.table.filters';

import { toast } from 'react-toastify';
import { generateExcel } from 'apps/rahat-ui/src/utils';
import { getPaginationFromLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import {
  Back,
  CustomPagination,
  Heading,
  IconLabelBtn,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { CloudDownloadIcon, Plus } from 'lucide-react';

import FiltersTags from 'apps/rahat-ui/src/common/filtersTags';

export default function ActivitiesList() {
  const { id: projectID, title } = useParams();
  const searchParams = useSearchParams();
  const [filtersApplied, setFiltersApplied] = React.useState(false);
  useActivitiesCategories(projectID as UUID);
  usePhases(projectID as UUID);
  const [activitySearchText, setActivitySearchText] =
    React.useState<string>('');
  const [responsibilitySearchText, setResponsibilitySearchText] =
    React.useState<string>('');
  const [phaseFilterItem, setPhaseFilterItem] = React.useState<string>('');
  const [categoryFilterItem, setCategoryFilterItem] =
    React.useState<string>('');
  const [statusFilterItem, setStatusFilterItem] = React.useState<string>('');
  const { categories } = useActivitiesStore((state) => ({
    categories: state.categories,
  }));
  const { phases } = usePhasesStore((state) => ({
    phases: state.phases,
  }));
  const {
    pagination,
    setNextPage,
    setPrevPage,
    setPerPage,
    setPagination,
    setFilters,
    filters,
  } = usePagination();

  React.useEffect(() => {
    const titleStr = Array.isArray(title) ? title[0] : title;
    const formattedTitle = titleStr.toUpperCase();

    const isBackFromDetail = searchParams.get('backFromDetail') === 'true';
    const prevPagination = getPaginationFromLocalStorage(isBackFromDetail);

    setFilters((prev) => ({
      ...prev,
      phase: phases.find((p) => p.name === formattedTitle)?.uuid,
    }));

    setPagination(prevPagination);
    setFiltersApplied(true);
  }, [phases, title]);

  const router = useRouter();

  const { activitiesData, activitiesMeta, isLoading } = useActivities(
    projectID as UUID,
    filtersApplied ? { ...pagination, ...filters } : null,
  );

  const { activitiesData: allData } = useActivities(
    projectID as UUID,
    filtersApplied ? { perPage: activitiesMeta?.total, ...filters } : null,
  );

  const columns = useActivitiesTableColumn();

  const table = useReactTable({
    manualPagination: true,
    data: activitiesData ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFilter = React.useCallback(
    (key: string, value: any) => {
      if (value === 'all') {
        setFilters({ ...filters, [key]: null });
        return;
      }
      setFilters({ ...filters, [key]: value });
    },
    [filters],
  );

  const handleSearch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
      setFilters({ ...filters, [key]: event.target.value });
    },
    [filters],
  );

  React.useEffect(() => {
    setActivitySearchText(filters?.title ?? '');
    setResponsibilitySearchText(filters?.responsibility ?? '');
    setPhaseFilterItem(filters?.phase ?? '');
    setCategoryFilterItem(filters?.category ?? '');
    setStatusFilterItem(filters?.status ?? '');
  }, [filters]);

  const handleDownloadReport = () => {
    if (allData.length < 1) return toast.error('No data to download.');
    const mappedData = allData?.map((item: Record<string, any>) => {
      let timeStamp;
      if (item?.completedAt) {
        const d = new Date(item.completedAt);
        const localeDate = d.toLocaleDateString();
        const localeTime = d.toLocaleTimeString();
        timeStamp = `${localeDate} ${localeTime}`;
      }
      return {
        Title: item.title || 'N/A',
        'Early Action': item.category || 'N/A',
        Phase: item.phase || 'N/A',
        Type: item.isAutomated ? 'Automated' : 'Manual' || 'N/A',
        Responsibility: item.responsibility,
        'Responsible Station': item.source || 'N/A',
        Status: item.status || 'N/A',
        Timestamp: timeStamp || 'N/A',
        'Completed by': item.completedBy || 'N/A',
        'Difference in trigger and activity completion':
          item.timeDifference || 'N/A',
      };
    });

    generateExcel(mappedData, 'Activities_Report', 10);
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.uuid === id)?.name || id;
  };

  const formattedFilters = Object.fromEntries(
    Object.entries(filters)
      .filter(([key]) => key !== 'phase')
      .map(([key, value]) => {
        if (key === 'category' && value) {
          return [key, getCategoryName(value)];
        }
        return [key, value];
      }),
  );
  if (isLoading) {
    return <TableLoader />;
  }
  return (
    <div className="p-4">
      <div className="flex flex-col space-y-0">
        <Back path={`/projects/aa/${projectID}/activities`} />

        <div className="mt-4 flex justify-between items-center">
          <div>
            <Heading
              title={`${title[0].charAt(0).toUpperCase() + title.slice(1)}`}
              description="Track all the trigger reports here"
            />
          </div>
          <div className="flex space-x-3">
            <IconLabelBtn
              Icon={CloudDownloadIcon}
              handleClick={handleDownloadReport}
              name="Download"
              variant="outline"
              className="rounded w-full"
            />
            <IconLabelBtn
              Icon={Plus}
              handleClick={() =>
                router.push(`/projects/aa/${projectID}/activities/add`)
              }
              name="Add Activity"
              className="rounded w-full"
            />
          </div>
        </div>
      </div>
      <ActivitiesTableFilters
        projectID={projectID as UUID}
        handleFilter={handleFilter}
        handleSearch={handleSearch}
        activity={activitySearchText}
        responsibility={responsibilitySearchText}
        category={categoryFilterItem}
        status={statusFilterItem}
      />

      {Object.keys(filters).length > 1 && (
        <FiltersTags
          filters={formattedFilters}
          setFilters={(newFilters) =>
            setFilters({ phase: filters.phase, ...newFilters })
          }
          total={table.getRowModel().rows?.length}
        />
      )}

      <div className="rounded border border-gray-100">
        <ActivitiesTable table={table} />
        <CustomPagination
          meta={
            activitiesMeta || {
              total: 0,
              currentPage: 0,
              lastPage: 0,
              perPage: 0,
              next: null,
              prev: null,
            }
          }
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={activitiesMeta?.lastPage || 0}
        />
      </div>
    </div>
  );
}
