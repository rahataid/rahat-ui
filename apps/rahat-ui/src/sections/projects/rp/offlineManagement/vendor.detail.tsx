'use client';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { DetailsTable } from './details.table';
import { ArrowLeft, Banknote, Coins, Home, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VendorDetails = () => {
  const router = useRouter();
  return (
    <div className="bg-card rounded-lg m-4 p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
          <h1 className="text-2xl font-semibold text-gray-900">Vendor Name</h1>
        </div>
        <p className="text-gray-500 font-normal text-base">
          Here is the detailed view of the vendor
        </p>
      </div>
      <div className="my-6 grid grid-cols-3 gap-3">
        <DataCard
          className=""
          title="Offline Beneficiaries"
          number={'0'}
          Icon={Users}
        />
        <DataCard
          className=""
          title="Token Assigned"
          number={'0'}
          Icon={Banknote}
        />
        <DataCard className="" title="Token Amount" number={'0'} Icon={Coins} />
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <h1 className="text-xl font-semibold text-gray-900">Beneficiaries</h1>
        <p className="text-gray-500 font-normal text-xs">
          List of all the beneficiaries assigned to the vendor
        </p>
      </div>
      <div>
        <DetailsTable />
      </div>
    </div>
  );
};

export default VendorDetails;
