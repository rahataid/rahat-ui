import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { Banknote, Home, Plus } from 'lucide-react';
import React from 'react';

const AssetsDetails = () => {
  return (
    <div className="p-2 bg-secondary h-[calc(100vh-80px)]">
      <div className="grid grid-cols-4 gap-2">
        <DataCard className="" title="Name" number={'N/A'} Icon={Banknote} />
        <DataCard className="" title="Symbol" number={'N/A'} Icon={Banknote} />
        <DataCard className="" title="Balance" number={'N/A'} Icon={Banknote} />
        <DataCard className="" title="Value" number={'N/A'} Icon={Banknote} />
      </div>
      <div className="mt-2">
        <div className="bg-card h-[calc(100vh-500px)] w-full flex justify-center items-center">
          <Button>
            <Plus className="mr-2" size={20} strokeWidth={1.25} />
            Send fund to project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetsDetails;
