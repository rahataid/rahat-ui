'use client';

import { useSettingsStore } from '@rahat-ui/query';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Banknote } from 'lucide-react';
import { AssetsModal } from './assets.modal';

const AssetsDetails = () => {
  const appContracts = useSettingsStore((state) => state.contracts);
  console.log('contracts', appContracts);

  return (
    <div className="p-2 bg-secondary h-[calc(100vh-80px)]">
      <div className="grid grid-cols-4 gap-2">
        <DataCard
          className=""
          title="Name"
          number="RahatToken"
          Icon={Banknote}
        />
        <DataCard className="" title="Symbol" number={'RTH'} Icon={Banknote} />
        <DataCard className="" title="Balance" number={'0'} Icon={Banknote} />
        <DataCard className="" title="Value" number={'0'} Icon={Banknote} />
      </div>
      <div className="mt-2">
        <div className="bg-card h-[calc(100vh-500px)] w-full flex flex-col justify-center items-center">
          <AssetsModal />
        </div>
      </div>
    </div>
  );
};

export default AssetsDetails;
