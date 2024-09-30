'use client';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import { DetailsTable } from './details.table';
import { ArrowLeft, Banknote, Coins, Home, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useGetOfflineSingleVendor } from '@rahat-ui/query';
import { UUID } from 'crypto';

const VendorDetails = () => {
  const router = useRouter();
  const { id, bid } = useParams();
  const { data: offlineVendor, isSuccess } = useGetOfflineSingleVendor(
    id as UUID,
    Number(bid),
  );

  return (
    <div className="bg-card rounded-lg m-4 p-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ArrowLeft
            onClick={() => router.push(`/projects/rp/${id}/offlineManagement`)}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            {offlineVendor?.extras?.name}
          </h1>
          {offlineVendor?.synced && <p>Synced</p>}
        </div>
        <p className="text-gray-500 font-normal text-base">
          Here is the detailed view of the vendor
        </p>
      </div>
      <div className="my-6 grid grid-cols-3 gap-3">
        <DataCard
          className=""
          title="Offline Beneficiaries"
          number={offlineVendor?.data?.length}
          Icon={Users}
        />
        <DataCard
          className=""
          title="Token Assigned"
          number={offlineVendor?.extras?.totalAmountAssigned?.toString()}
          Icon={Banknote}
        />
        {/* <DataCard
          className=""
          title="Token Amount"
          number={offlineVendor?.totalAmountAssigned}
          Icon={Coins}
        /> */}
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <h1 className="text-xl font-semibold text-gray-900">Beneficiaries</h1>
        <p className="text-gray-500 font-normal text-xs">
          List of all the beneficiaries assigned to the vendor
        </p>
      </div>
      <div>
        <DetailsTable
          offlineBeneficiaries={offlineVendor?.data || []}
        />
      </div>
    </div>
  );
};

export default VendorDetails;
