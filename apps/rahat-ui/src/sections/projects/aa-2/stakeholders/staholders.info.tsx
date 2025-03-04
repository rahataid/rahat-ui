import { Coins, Copy, CopyCheck, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
// import DataCard from '../../common/dataCard';
import DataItem from '../../../common/dataItem';
import useCopy from '../../../hooks/useCopy';
import { DataCard } from '../../../common';

const StakeHolderInfo = () => {
  const { id } = useParams();
  return (
    <>
      <div className="flex items-center">
        <div className="h-24 w-24 rounded-md  bg-gray-700 flex justify-center items-center">
          <User className="" color="white" />
        </div>

        <div className="flex flex-col ml-6">
          <h1 className="text-2xl">Stake holders Name</h1>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 px-6 py-4">
        <DataItem label="Phone Number" value={'+9779845712531'} />
        <DataItem label="Email" value={'email@rumsan.net'} />
        <DataItem label="Designation" value={'Officer'} />
        <DataItem label="Organization" value={'Rumsan'} />
        <DataItem label="District " value={' Kathmandu '} />
        <DataItem label="Municipality" value={'Ktm'} />
      </div>
    </>
  );
};

export default StakeHolderInfo;
