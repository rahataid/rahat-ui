'use client';

import React, { useState } from 'react';
import { useQueueJobsQuery } from './queries/useQueueJobsQuery';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import SpinnerLoader from '../projects/components/spinner.loader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@rahat-ui/shadcn/src/components/ui/table';

import RetryButton from './retry-button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useTranslations } from 'next-intl';

const queueTypes = [
  { label: 'CONTRACT_JOBS', value: 'contract-jobs' },
  { label: 'RAHAT_JOBS', value: 'rahat-jobs' },
  { label: 'RAHAT_BENEFICIARY_JOBS', value: 'rahat-beneficiary-jobs' },
  { label: 'META_TRANSACTION_JOBS', value: 'meta-txn-jobs' },
];

// / Recursive function to render nested data
export const renderNestedData = (data: any, depth = 0): React.ReactNode => {
  if (Array.isArray(data)) {
    return (
      <ul className="list-disc pl-5">
        {data.map((item, index) => (
          <li key={index}>{renderNestedData(item, depth + 1)}</li>
        ))}
      </ul>
    );
  } else if (typeof data === 'object' && data !== null) {
    return (
      <ul className="list-disc pl-5">
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {renderNestedData(value, depth + 1)}
          </li>
        ))}
      </ul>
    );
  } else {
    return <span>{data}</span>;
  }
};

const QueueList: React.FC = () => {
  const t = useTranslations('QUEUES');
  const tg = useTranslations('GLOBAL');
  const [queueType, setQueueType] = useState(queueTypes[0].value);
  const [filters, setFilters] = useState({
    status: '',
    name: '',
    startDate: '',
    endDate: '',
  });
  const { data, isLoading } = useQueueJobsQuery(queueType, {
    ...filters,
    status: filters.status ? [filters.status] : undefined,
  });
  const [selectedJob, setSelectedJob] = useState(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', name: '', startDate: '', endDate: '' });
  };

  const openJobDetails = (job: any) => {
    setSelectedJob(job);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="p-6 space-y-6 rounded-lg bg-white text-gray-800 shadow-lg dark:bg-gray-900 dark:text-gray-200 transition-colors">
      {/* Dynamic Tabs for Queue Types */}
      <Tabs
        defaultValue={queueType}
        onValueChange={(value) => setQueueType(value)}
      >
        <TabsList className="space-x-2 border-b border-gray-300 dark:border-gray-700">
          {queueTypes.map((type) => (
            <TabsTrigger
              key={type.value}
              value={type.value}
              className="px-4 py-2 text-sm font-medium text-gray-700 rounded dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {t(type.label)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={queueType}>
          <div className="space-y-4 mt-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                name="status"
                onChange={handleChange}
                className="bg-gray-100 border border-gray-300 text-gray-800 rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="">{tg('ALL')}</option>
                <option value="waiting">{t('WAITING')}</option>
                <option value="active">{t('ACTIVE')}</option>
                <option value="completed">{t('COMPLETED')}</option>
                <option value="failed">{tg('FAILED')}</option>
                <option value="delayed">{t('DELAYED')}</option>
              </select>
              <Input
                placeholder={t('JOB_NAME')}
                name="name"
                onChange={handleChange}
                className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              />
              <Input
                type="date"
                name="startDate"
                onChange={handleChange}
                className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              />
              <Input
                type="date"
                name="endDate"
                onChange={handleChange}
                className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              />
              <Button
                variant="secondary"
                onClick={clearFilters}
                className="bg-blue-500 text-white dark:bg-blue-600"
              >
                {t('CLEAR_FILTERS')}
              </Button>
            </div>

            {/* Table with Jobs */}
            <div className="relative overflow-hidden rounded-lg shadow-md">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <SpinnerLoader />
                </div>
              ) : (
                <Table className="w-full min-w-full bg-white rounded-lg dark:bg-gray-900">
                  <TableHeader className="bg-gray-100 dark:bg-gray-800">
                    <TableRow className="border-b border-gray-300 dark:border-gray-700">
                      <TableCell className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-left whitespace-nowrap">
                        {t('JOB_ID')}
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-left whitespace-nowrap">
                        {t('JOB_NAME')}
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-left whitespace-nowrap">
                        {t('PROCESSED_ON')}
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-left whitespace-nowrap">
                        {t('FINISHED_ON')}
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-left whitespace-nowrap">
                        {tg('STATUS')}
                      </TableCell>
                      <TableCell className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-left whitespace-nowrap">
                        {t('RETRY')}
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map(
                      (job: {
                        id: string;
                        name: string;
                        status: string;
                        processedOn: string;
                        finishedOn: string;
                        attemptsMade: number;
                        failedReason: string;
                        data: any;
                      }) => (
                        <TableRow
                          key={job.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                        >
                          <TableCell className="p-4 text-gray-800 dark:text-gray-300 text-left whitespace-nowrap">
                            {job.id}
                          </TableCell>
                          <TableCell className="p-4 text-gray-800 dark:text-gray-300 text-left whitespace-nowrap">
                            {job.name}
                          </TableCell>
                          <TableCell className="p-4 text-gray-800 dark:text-gray-300 text-left whitespace-nowrap">
                            {new Date(job.processedOn).toLocaleString()}
                          </TableCell>
                          <TableCell className="p-4 text-gray-800 dark:text-gray-300 text-left whitespace-nowrap">
                            {new Date(job.finishedOn).toLocaleString()}
                          </TableCell>
                          <TableCell className="p-4 text-gray-800 dark:text-gray-300 text-left whitespace-nowrap">
                            {job.status}
                          </TableCell>

                          <TableCell className="p-4 text-gray-800 dark:text-gray-300 text-left whitespace-nowrap">
                            {
                              <>
                                <RetryButton
                                  queueType={queueType}
                                  jobId={job.id}
                                />
                                <Button
                                  onClick={() => openJobDetails(job)}
                                  className="bg-blue-500 text-white"
                                >
                                  {tg('DETAILS')}
                                </Button>
                              </>
                            }
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for Job Details */}
      {selectedJob && (
        <Dialog open={true} onOpenChange={closeJobDetails}>
          <DialogContent>
            <DialogTitle>{t('JOB_DETAILS')}</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                <strong>{t('JOB_ID2')}</strong> {selectedJob.id}
              </p>
              <p>
                <strong>{t('JOB_NAME2')}</strong> {selectedJob.name}
              </p>
              <p>
                <strong>{t('STATUS')}</strong> {selectedJob.status}
              </p>
              <p>
                <strong>{t('PROCESSED_ON2')}</strong>{' '}
                {new Date(selectedJob.processedOn).toLocaleString()}
              </p>
              <p>
                <strong>{t('FINISHED_ON2')}</strong>{' '}
                {new Date(selectedJob.finishedOn).toLocaleString()}
              </p>
              <p>
                <strong>{t('ATTEMPTS_MADE')}</strong> {selectedJob.attemptsMade}
              </p>
              <p>
                <strong>{t('FAILED_REASON')}</strong> {selectedJob.failedReason}
              </p>
              <p>
                <strong>{t('BATCH_DETAILS')}</strong>
              </p>
              <div className="max-h-64 overflow-y-auto">
                <div className="max-h-64 overflow-y-auto">
                  {renderNestedData(selectedJob.data, 5)}
                </div>
              </div>
            </DialogDescription>
            <DialogFooter>
              <Button
                onClick={closeJobDetails}
                className="bg-blue-500 text-white"
              >
                {tg('CLOSE')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default QueueList;
