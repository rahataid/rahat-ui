import { DataCard, Heading } from 'apps/rahat-ui/src/common';
import React from 'react';
type Props = {
  data: {
    benefStats: any[];
    triggeersStats: any[];
  };
};
const CommunicationAnalytics = ({
  benefStats,
  triggeersStats,
  projectId,
}: any) => {
  // console.log(triggeersStats);
  const getTriggerDataByName = (name: string) =>
    triggeersStats.find((item) => item.name.includes(name))?.data;

  // ✅ Cards: Get counts
  const activitiesWithComm =
    getTriggerDataByName('ACTIVITIES_WITH_COMM')?.count || 0;
  const activitiesAutomated =
    getTriggerDataByName('ACTIVITIES_AUTOMATED')?.count || 0;

  // ✅ Comms data
  const commsStats = getTriggerDataByName('COMMS_STATS');
  const benefCountsSession =
    getTriggerDataByName(`BENEFICIARY_${projectId?.toUpperCase()}`)
      ?.sessionCount || 0;
  const stakeholdersCountsSession =
    getTriggerDataByName(`STAKEHOLDERS_${projectId?.toUpperCase()}`)
      ?.sessionCount || 0;

  const formatCommsStats = () => {
    const stakeholders = commsStats?.stakeholder || {};
    const beneficiaries = commsStats?.beneficiary || {};

    const stakeholderStats = {
      category: 'Stakeholders',
      totalCommunicationSent: stakeholdersCountsSession,
      numberOfStakeholders: benefStats?.find(
        (stat) => stat.name === 'STAKEHOLDERS_TOTAL',
      )?.data?.count,
      avcSuccessfullySent: stakeholders?.VOICE?.SUCCESS || 0,
      smsSuccessfullySent: stakeholders?.SMS?.SUCCESS || 0,
      deliveryFailures: stakeholders?.VOICE?.FAIL || 0,
    };

    const beneficiaryStats = {
      category: 'Beneficiaries',
      totalCommunicationSent: benefCountsSession,
      avcSuccessfullySent: beneficiaries?.VOICE?.SUCCESS || 0,
      smsSuccessfullyDelivered:
        (beneficiaries?.SMS?.SUCCESS || 0) +
        (beneficiaries?.['Prabhu SMS']?.SUCCESS || 0),
      smsAndAvcDeliveryFailures: beneficiaries?.VOICE?.FAIL || 0,
      uniqueAvcRecipients: 0, // Not available in current data
    };

    return [stakeholderStats, beneficiaryStats];
  };

  const communicationData = formatCommsStats();
  return (
    <>
      <div className="flex flex-col mt-4">
        <Heading
          title="Communications & Outreach"
          titleStyle="text-lg"
          description="Reach and effectiveness of communication channels"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
          <DataCard
            title="Activities with Communication"
            className="rounded-sm"
            number={activitiesWithComm.toString()}
          />
          <DataCard
            title="Activities Automated"
            className="rounded-sm"
            number={activitiesAutomated.toString()}
          />

          {communicationData.map((item, idx) => (
            <div
              className="w-full border bg-white rounded-sm shadow p-6"
              key={item.category}
            >
              <h3 className="text-sm font-semibold text-gray-700">
                Total Communication Sent
              </h3>
              <h4 className="text-md font-medium text-gray-500 mt-1">
                {item.category}
              </h4>
              <div className="text-3xl font-bold text-primary my-3">
                {item.totalCommunicationSent}
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4">
                {Object.entries(item).map(([key, value]) => {
                  if (['category', 'totalCommunicationSent'].includes(key))
                    return null;

                  const label =
                    key === 'smsAndAvcDeliveryFailures'
                      ? 'SMS & AVC Delivery Failures'
                      : key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, (str) => str.toUpperCase())
                          .replace(/\bSms\b/gi, 'SMS')
                          .replace(/\bAvc\b/gi, 'AVC');

                  return (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="font-semibold text-gray-800">
                        {/* {value.toLocaleString()} */}
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommunicationAnalytics;
