import getIcon from 'apps/rahat-ui/src/utils/getIcon';
import CommunicationLogTable from './communicationLogTable';

export default function CommunicationLogsView() {
  // const { id: projectID } = useParams();
  // const { data: commsStats } = useCommunicationStats(projectID as UUID);

  // const findData = (name: string, type: string) => {
  //   return commsStats
  //     ?.filter((item: any) => item.name === name)
  //     ?.flatMap((item: any) => item.data)
  //     ?.find((i: any) => i.type === type);
  // };

  // const smsRecipients = findData('AUDIENCE', 'SMS');
  // const ivrRecipients = findData('AUDIENCE', 'IVR');
  // const ivrSent = findData('CAMPAIGN', 'IVR');
  // const emailSent = findData('CAMPAIGN', 'EMAIL');
  // const smsSent = findData('CAMPAIGN', 'SMS');
  // const ivrSuccessRate = commsStats?.find(
  //   (stats: any) => stats.name === 'IVRSUCCESSRATE',
  // )?.data;
  // const averageIvrAttempts = commsStats?.find(
  //   (stats: any) => stats.name === 'AVERAGEIVRATTEMPT',
  // )?.data;

  // const averageIvrDuration = commsStats?.find(
  //   (stats: any) => stats.name === 'IVRDURATION',
  // )?.data;

  const commStats = [
    {
      componentType: 'DATACARD',
      title: 'SMS Recipients',
      value: 0,
      icon: 'MessageSquare',
    },
    {
      componentType: 'DATACARD',
      title: 'IVR Recipients',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'Total SMS sent to Beneficiaries',
      value: 0,
      icon: 'MessageSquare',
    },
    {
      componentType: 'DATACARD',
      title: 'Total IVR sent to Beneficiaries',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'Total EMAIL sent to Beneficiaries',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'IVR Success Rate',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'Average IVR Attempts',
      value: 0,
      icon: 'AudioLines',
    },
    {
      componentType: 'DATACARD',
      title: 'Average Duration of IVR',
      value: 0,
      icon: 'AudioLines',
    },
  ];

  return (
    <div className="p-4 bg-secondary h-[calc(100vh-65px)]">
      <h1 className="text-md font-semibold">Communication Summary</h1>

      <div className="grid md:grid-cols-4 gap-2 mt-2">
        {commStats.map((d) => {
          if (d.componentType === 'DATACARD') {
            const Icon = getIcon(d.icon);
            return (
              <div className="rounded-sm bg-card px-3 pt-2 pb-1 shadow-md">
                <div className="flex justify-between items-center">
                  <h1 className="text-sm">{d.title}</h1>
                  <div className="p-1 rounded-full bg-secondary text-primary">
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
                </div>
                <p className="text-primary font-semibold text-xl">{d.value}</p>
              </div>
            );
          }
        })}
      </div>
      <div className=" mt-4">
        <CommunicationLogTable />
      </div>
    </div>
  );
}
