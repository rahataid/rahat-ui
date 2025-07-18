import { DataCard } from 'apps/rahat-ui/src/common';
import React from 'react';

const CommunicationAnalytics = () => {
  const communicationData = [
    {
      category: 'Stakeholders',
      totalCommunicationSent: 23000,
      numberOfStakeholders: 5000,
      avcsSuccessfullySent: 5000,
      smsSuccessfullySent: 2000,
      deliveryFailures: 1000,
    },
    {
      category: 'Beneficiaries',
      totalCommunicationSent: 23000,
      avcsSuccessfullySent: 5000,
      voiceMessageDelivered: 2000,
      smsSuccessfullyDelivered: 1000,
      deliveryFailures: 2000,
      uniqueAvcRecipients: 1000,
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
        <DataCard
          title="Activities with Communication"
          className="rounded-sm"
          smallNumber="10"
        />
        <DataCard
          title="Activities Automated"
          className="rounded-sm"
          smallNumber="10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
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
            <div className="text-3xl font-bold text-blue-600 my-3">
              {item.totalCommunicationSent.toLocaleString()}
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-4">
              {Object.entries(item).map(([key, value]) => {
                if (['category', 'totalCommunicationSent'].includes(key))
                  return null;

                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-800">
                      {value.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CommunicationAnalytics;
