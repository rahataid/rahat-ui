import { Ticket } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import { useParams } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import BeneficiaryView from './beneficiary.view';
import BeneficiaryGroupsView from './beneficiary.groups.view';
import DataCard from 'apps/rahat-ui/src/components/dataCard';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useReadRahatTokenBalanceOf,
} from '@rahat-ui/query';
import { UUID } from 'crypto';
import { useAccount } from 'wagmi';

interface VouchersManageProps {
  handleStepDataChange: (e) => void;
  handleNext: any;
  setBeneficiaryGroupSelected: any;
  stepData: any;
}

export default function VouchersManage({
  handleStepDataChange,
  handleNext,
  setBeneficiaryGroupSelected,
  stepData,
}: VouchersManageProps) {
  const { id } = useParams() as { id: UUID };
  const { isConnected } = useAccount();

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data: tokenBalance } = useReadRahatTokenBalanceOf({
    address: contractSettings?.rahattoken?.address,
    args: [contractSettings?.rahatcvakenya?.address],
  });
  return (
    <div className="p-4 pb-0">
      <HeaderWithBack
        title="Create Voucher Disbursement"
        path={`/projects/el-kenya/${id}/vouchers`}
        subtitle="Create a disbursement plan"
      />
      <DataCard
        className="border-solid rounded-sm w-96 mb-4"
        title="Voucher Balance"
        Icon={Ticket}
        number={tokenBalance?.toString() ?? '-'}
      />
      {!isConnected ? (
        <div className=" flex justify-center items-center mb-4">
          <p className="text-muted-foreground">
            Please connect your wallet to proceed
          </p>
        </div>
      ) : (
        <Tabs defaultValue="beneficiary">
          <TabsContent value="beneficiary">
            <div className="pl-4">
              <h1 className=" font-semibold text-xl ">Beneficiary</h1>
              <p className="text-muted-foreground text-base">
                List of all the beneficiaries assigned to the vendors
              </p>
            </div>
          </TabsContent>
          <TabsContent value="beneficiaryGroups">
            <div className="pl-4">
              <h1 className=" font-semibold text-xl ">Beneficiary Groups</h1>
              <p className="text-muted-foreground text-base">
                List of all the beneficiaries groups assigned to the vendors
              </p>
            </div>
          </TabsContent>
          <div className="flex justify-between items-center p-4 pt-3 pb-0">
            <TabsList className="border bg-secondary rounded">
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value="beneficiary"
              >
                Beneficiary
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value="beneficiaryGroups"
              >
                Beneficiary Groups
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="beneficiary">
            <BeneficiaryView
              handleStepDataChange={handleStepDataChange}
              handleNext={handleNext}
            />
          </TabsContent>
          <TabsContent value="beneficiaryGroups">
            <BeneficiaryGroupsView
              handleStepDataChange={handleStepDataChange}
              handleNext={handleNext}
              setBeneficiaryGroupSelected={setBeneficiaryGroupSelected}
              stepData={stepData}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
