import {
  useCommunicationStats,
  useGetCommunicationLogs,
} from '@rahat-ui/query';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import CommunicationLogTable from './communicationLogTable';

export default function CommunicationLogsView() {
  const { id: projectID } = useParams();
  const { data: commsStats } = useCommunicationStats(projectID as UUID);
  const { data: commsLogs, isLoading } = useGetCommunicationLogs(
    projectID as UUID,
  );

  if (isLoading) return <TableLoader />;

  const findData = (name: string, type: string) => {
    return commsStats
      ?.filter((item: any) => item.name === name)
      ?.flatMap((item: any) => item.data)
      ?.find((i: any) => i.type === type);
  };

  const smsRecipients = findData('AUDIENCE', 'SMS');
  const ivrRecipients = findData('AUDIENCE', 'IVR');
  const ivrSent = findData('CAMPAIGN', 'IVR');
  const emailSent = findData('CAMPAIGN', 'EMAIL');
  const smsSent = findData('CAMPAIGN', 'SMS');

  const commStats = [
    {
      componentType: 'DATACARD',
      title: 'SMS Recipients',
      value: smsRecipients?.count || 0,
      icon: 'Home',
    },
    {
      componentType: 'DATACARD',
      title: 'IVR Recipients',
      value: ivrRecipients?.count || 0,
      icon: 'Home',
    },
    {
      componentType: 'DATACARD',
      title: 'Total SMS sent to Beneficiaries',
      value: smsSent?.count || 0,
      icon: 'Users',
    },
    {
      componentType: 'DATACARD',
      title: 'Total IVR sent to Beneficiaries',
      value: ivrSent?.count || 0,
      icon: 'Home',
    },
    {
      componentType: 'DATACARD',
      title: 'Total EMAIL sent to Beneficiaries',
      value: emailSent?.count || 0,
      icon: 'Users',
    },
    {
      componentType: 'DATACARD',
      title: 'IVR Success Rate',
      value: '0',
      icon: 'Home',
    },
    {
      componentType: 'DATACARD',
      title: 'Average IVR Attempts',
      value: '0',
      icon: 'Users',
    },
    {
      componentType: 'DATACARD',
      title: 'Average Duration of IVR',
      value: '0',
      icon: 'Home',
    },
  ];

  return (
    <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
      <h1 className="text-xl font-semibold">Communication Summary</h1>

      <div className="grid md:grid-cols-4 gap-4 mt-4">
        {commStats.map((d) => {
          if (d.componentType === 'DATACARD') {
            return (
              <DataCard
                title={d.title}
                number={d.value}
                Icon={getIcon(d.icon)}
              />
            );
          }
        })}
      </div>
      <div className=" mt-4">
        <CommunicationLogTable data={commsLogs} />
      </div>
    </div>
  );
}
