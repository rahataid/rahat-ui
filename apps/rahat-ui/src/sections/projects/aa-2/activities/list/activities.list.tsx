import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
  useActivities,
  useActivitiesCategories,
  useActivitiesStore,
  usePagination,
  usePhases,
} from '@rahat-ui/query';
import useActivitiesTableColumn from './useActivitiesTableColumn';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

import { UUID } from 'crypto';
import ActivitiesTableFilters from './activities.table.filters';

import { toast } from 'react-toastify';
import { generateExcel } from 'apps/rahat-ui/src/utils';
import { getPaginationFromLocalStorage } from 'apps/rahat-ui/src/utils/prev.pagination.storage';
import {
  Back,
  CustomPagination,
  DemoTable,
  Heading,
  IconLabelBtn,
  NoResult,
  TableLoader,
} from 'apps/rahat-ui/src/common';
import { CloudDownloadIcon, Plus, Upload } from 'lucide-react';

import FiltersTags from 'apps/rahat-ui/src/common/filtersTags';
import { Can } from 'apps/rahat-ui/src/components/can';
import {
  ACTIONS,
  SUBJECTS,
} from 'apps/rahat-ui/src/constants/ability.constants';
import { findActivityPhase } from '../activity-navigation';

// TODO:Remove this table if used nowhere
// import ActivitiesTable from './activities.table';

export default function ActivitiesList() {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const { id: projectID, title } = useParams();
  const searchParams = useSearchParams();
  useActivitiesCategories(projectID as UUID);
  const { data: phases, isError: phasesError } = usePhases(projectID as UUID);
  const phaseTitle = Array.isArray(title) ? title[0] : title;
  const selectedPhase = phases && findActivityPhase(phases, phaseTitle);
  const selectedPhaseId = selectedPhase?.uuid;
  const isBackFromDetail = searchParams.get('backFromDetail') === 'true';
  const [activitySearchText, setActivitySearchText] =
    React.useState<string>('');
  const [responsibilitySearchText, setResponsibilitySearchText] =
    React.useState<string>('');
  const [phaseFilterItem, setPhaseFilterItem] = React.useState<string>('');
  const [categoryFilterItem, setCategoryFilterItem] =
    React.useState<string>('');
  const [isAutomated, setIsAutomated] = React.useState<string>('');
  const [statusFilterItem, setStatusFilterItem] = React.useState<string>('');
  const { categories } = useActivitiesStore((state) => ({
    categories: state.categories,
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
    if (selectedPhaseId && filters.phase !== selectedPhaseId) {
      setFilters({ ...filters, phase: selectedPhaseId });
    }
  }, [selectedPhaseId, filters, setFilters]);
  React.useEffect(() => {
    if (selectedPhaseId) {
      setPagination(getPaginationFromLocalStorage(isBackFromDetail));
    }
  }, [selectedPhaseId, isBackFromDetail, setPagination]);

  const router = useRouter();
  const filtersApplied = !!selectedPhase && filters.phase === selectedPhase.uuid;

  const { activitiesData, activitiesMeta, isLoading } = useActivities(
    projectID as UUID,
    filtersApplied ? { ...pagination, ...filters } : null,
  );

  const { activitiesData: allData } = useActivities(
    projectID as UUID,
    filtersApplied ? { perPage: activitiesMeta?.total, ...filters } : null,
  );

  const formatDate = useDateFormat();
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
    setIsAutomated(filters?.type ?? '');
  }, [filters]);

  const handleDownloadReport = () => {
    if (!allData || allData.length < 1) return toast.error(t('NO_DATA_TO_DOWNLOAD'));
    const mappedData = allData?.map((item: Record<string, any>) => {
      let timeStamp;
      if (item?.completedAt) {
        timeStamp = formatDate(item.completedAt);
      }
      // leadTime is stored server-side as "<value> <unit>" (e.g. "3 days"),
      // split back into two columns to match the bulk-upload sheet format.
      const [leadTimeValue, leadTimeUnit] = (item.leadTime || '').split(' ');
      return {
        'Activity Title': item.title || 'N/A',
        Category: item.category || 'N/A',
        Phase: item.phase || 'N/A',
        Type: item.isAutomated ? t('AUTOMATED') : t('MANUAL'),
        Responsibility: item.responsibility || 'N/A',
        'Responsible Station': item.responsibleStation || 'N/A',
        'Lead Time': leadTimeValue || 'N/A',
        'Time Frame': leadTimeUnit || 'N/A',
        Status: item.status
          ? translateValue(tg, item.status, { fallbackStyle: 'raw' })
          : 'N/A',
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

  if (!phases && !phasesError) {
    return <TableLoader />;
  }
  if (phasesError || !selectedPhase) {
    return (
      <div className="p-4">
        <Back path={`/projects/aa/${projectID}/activities`} />
        <NoResult
          message={t(phasesError ? 'ERROR_LOADING_DATA' : 'NO_PHASES_AVAILABLE_SHORT')}
        />
      </div>
    );
  }
  if (isLoading || !filtersApplied) {
    return <TableLoader />;
  }
  return (
    <div className="p-4">
      <div className="flex gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <Back path={`/projects/aa/${projectID}/activities`} />
          <Heading
            title={phaseTitle.toUpperCase()}
            description={t('LIST_OF_ALL_THE_ACTIVITIES_IN')}
          />
        </div>
        <div className="flex flex-col gap-2 lg:flex-row items-center justify-center">
          <Can action={ACTIONS.READ} subject={SUBJECTS.ACTIVITY}>
            <IconLabelBtn
              Icon={CloudDownloadIcon}
              handleClick={handleDownloadReport}
              name={t('DOWNLOAD')}
              variant="outline"
              className="rounded w-full"
            />
          </Can>
          <Can action={ACTIONS.CREATE} subject={SUBJECTS.ACTIVITY}>
            <IconLabelBtn
              Icon={Upload}
              handleClick={() => {
                const phase = selectedPhase;
                const params = new URLSearchParams({
                  isRequiredLeadTime: String(!!phase.isRequiredLeadTime),
                  isAutomatedActivity: String(!!phase.isAutomatedActivity),
                  phase: phaseTitle,
                });
                router.push(
                  `/projects/aa/${projectID}/activities/bulk-upload?${params}`,
                );
              }}
              name={t('BULK_UPLOAD')}
              variant="outline"
              className="rounded w-full"
            />
          </Can>
          <Can action={ACTIONS.CREATE} subject={SUBJECTS.ACTIVITY}>
            <IconLabelBtn
              Icon={Plus}
              handleClick={() => {
                const params = new URLSearchParams({
                  phaseId: selectedPhase.uuid,
                  from: phaseTitle,
                });
                router.push(
                  `/projects/aa/${projectID}/activities/add?${params}`,
                );
              }}
              name={t('ADD_ACTIVITY')}
              className="rounded w-full"
            />
          </Can>
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
        isAutomated={isAutomated}
      />
      {Object.keys(filters).length > 1 && (
        <FiltersTags
          filters={formattedFilters}
          setFilters={(newFilters: any) =>
            setFilters({ phase: filters.phase, ...newFilters })
          }
          total={table.getRowModel().rows?.length}
        />
      )}
      <div className=" border-gray-100 overflow-hidden rounded-lg border ">
        <DemoTable
          table={table}
          loading={isLoading}
          tableHeight={
            Object.keys(filters).length === 1
              ? 'h-[calc(100vh-320px)]'
              : 'h-[calc(100vh-380px)]'
          }
        />
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
          setPagination={setPagination}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={activitiesMeta?.lastPage || 0}
          isShowTotalCount={true}
        />
      </div>
    </div>
  );
}
