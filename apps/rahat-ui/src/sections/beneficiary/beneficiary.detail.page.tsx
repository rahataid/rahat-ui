// import { useBeneficaryVoucher } from '../../hooks/el/subgraph/querycall';
// // import BeneficiaryDetailTableView from './beneficiaryDetailTable';
// import InfoCards from './infoCards';

// export default function BeneficiaryDetailPageView() {
//   const { data: voucherData, error: voucherError } = useBeneficaryVoucher(
//     '0x082d43D30C31D054b1AEDbE08F50C2a1BBE76fC7',
//   );

//   return (
//     <>
//       <InfoCards voucherData={voucherData} voucherError={voucherError} />
//       {/* <BeneficiaryDetailTableView
//         tableSpacing="p-2"
//         tableScrollAreaHeight="h-[calc(100vh-303px)]"
//       /> */}
//     </>
//   );
// }

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import React from 'react';
import { Copy, CopyCheck, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import HeaderWithBack from '../projects/components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { UUID } from 'crypto';
import CoreBtnComponent from '../../components/core.btn';
import { useBeneficiaryStore, useSingleBeneficiary } from '@rahat-ui/query';

export default function BeneficiaryDetail() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();
  // const [walletAddressCopied, setWalletAddressCopied] =
  //   React.useState<string>();

  const beneficiary = useBeneficiaryStore((state) => state.singleBeneficiary);

  // const clickToCopy = (walletAddress: string) => {
  //   navigator.clipboard.writeText(walletAddress);
  //   setWalletAddressCopied(walletAddress);
  // };
  return (
    <div className="p-4">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <HeaderWithBack
          title="Beneficiary Details"
          subtitle="Here is a detailed view of the selected beneficiary"
          path="/beneficiary"
        />
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <CoreBtnComponent
            className="text-primary bg-sky-50"
            name="Assign to Project"
            Icon={FolderPlus}
            handleClick={() => {}}
          />
          <CoreBtnComponent
            name="Edit"
            Icon={Pencil}
            handleClick={() => {
              router.push(`/beneficiary/${id}/edit`);
            }}
          />
          <CoreBtnComponent
            className="bg-red-100 text-red-600"
            name="Delete"
            Icon={Trash2}
            handleClick={() => {}}
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="p-5 rounded-md shadow border grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <div>
          <h1 className="text-md text-muted-foreground">Beneficiary Name</h1>
          <p className="font-medium">{beneficiary?.piiData?.name || 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Gender</h1>
          <p className="font-medium">{beneficiary?.gender ?? 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Estimated Age</h1>
          <p className="font-medium">{beneficiary?.age ?? 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Address</h1>
          <p className="font-medium">{beneficiary?.location ?? 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Number</h1>
          <p className="font-medium">{beneficiary?.piiData?.phone ?? 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Email Address</h1>
          <p className="font-medium">{beneficiary?.piiData?.email ?? 'N/A'}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Phone Status</h1>
          <Badge>{beneficiary?.phoneStatus ?? 'N/A'}</Badge>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Bank Status</h1>
          <Badge>{beneficiary?.bankedStatus ?? 'N/A'}</Badge>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">Internet Status</h1>
          <Badge>{beneficiary?.internetStatus ?? 'N/A'}</Badge>
        </div>
      </div>
    </div>
  );
}
