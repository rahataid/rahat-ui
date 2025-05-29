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
  useReadRahatTokenTotalSupply,
} from '@rahat-ui/query';
import { UUID } from 'crypto';

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

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const { data: tokenBalance } = useReadRahatTokenTotalSupply({
    address: contractSettings?.rahattoken?.address as `0x${string}`,
  });
  return (
    <div className="p-4 pb-0">
      <HeaderWithBack
        title="Create Voucher Disbursement"
        path={`/projects/el-kenya/${id}/vouchers`}
        subtitle=""
      />
      <DataCard
        className="border-solid rounded-sm w-96 mb-2"
        title="Voucher Balance"
        Icon={Ticket}
        number={tokenBalance?.toString() ?? '-'}
      />
      <Tabs defaultValue="beneficiary">
        <TabsContent value="beneficiary">
          <div className="pl-4">
            <h1 className=" font-semibold text-xl ">Select Beneficiary</h1>
          </div>
        </TabsContent>
        <TabsContent value="beneficiaryGroups">
          <div className="pl-4">
            <h1 className=" font-semibold text-xl ">
              Select Beneficiary Groups
            </h1>
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
    </div>
  );
}
