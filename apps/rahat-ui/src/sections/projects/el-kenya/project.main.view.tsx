'use client';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { useGetProjectDatasource, useProjectStore } from '@rahat-ui/query';
import ELKenyaProjectDetail from './project.detail';
import DownloadReportBtn from 'apps/rahat-ui/src/components/download.report.btn';
import { generateExcel } from './generate.excel';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@rumsan/react-query';

const ProjectMainView = () => {
  const { id } = useParams() as { id: UUID };
  const token = useAuthStore.getState().token;

  const project = useProjectStore((state) => state.singleProject);
  const { data: newDatasource, isLoading } = useGetProjectDatasource(id);

  const fetchDataForSource = async (source: string) => {
    let fetchedData;
    try {
      const dataSource = newDatasource[0]?.data?.dataSources[source];

      const response = await fetch(dataSource.args.url, {
        ...dataSource.args.apiCallData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          ...dataSource.args.apiCallData?.headers,
        },
      });
      console.log('response', response);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${dataSource.args.url}`);
      }
      const res = await response.json();
      fetchedData = res?.data;
    } catch (error) {
      console.error(error);
      fetchedData = null;
    }
    return fetchedData;
  };

  async function handleDownload() {
    const promises = Object.keys(newDatasource[0]?.data?.dataSources).map(
      fetchDataForSource,
    );
    const results = await Promise.all(promises);
    console.log(results);

    generateExcel(results[0], 'EL_Report', newDatasource[0]?.data?.ui);
  }
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div>
          <h1 className="font-semibold text-[28px] mb-2">
            Welcome to CVA Dashboard
          </h1>
          <p className="text-muted-foreground text-base">
            Your Hub for Real-Time Analytics and Data Visualization of the
            system
          </p>
        </div>

        <DownloadReportBtn handleDownload={handleDownload} />
      </div>
      <ScrollArea className="mt-5 h-[calc(100vh-185px)]">
        <ELKenyaProjectDetail />
      </ScrollArea>
    </div>
  );
};

export default ProjectMainView;
