import { Ticket } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import Back from '../../components/back';
import { useParams } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import BeneficiaryView from './beneficiary.view';
import BeneficiaryGroupsView from './beneficiary.groups.view';

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
  const { id } = useParams();
  return (
    <div className="p-4 h-[calc(100vh-65px)]">
      <HeaderWithBack
        title="Create Voucher Disbursement"
        path={`/projects/el-kenya/${id}/vouchers`}
        subtitle="Create a disbursement plan"
      />
      <div className="rounded-sm bg-card p-6 shadow-md w-96 mb-10">
        <div className="flex justify-between items-center">
          <h1 className="text-sm">Voucher Balance</h1>
          <div className="p-1 rounded-full bg-secondary text-primary">
            <Ticket size={16} strokeWidth={2.5} />
          </div>
        </div>
        <p className="text-primary font-semibold text-xl">1439</p>
      </div>
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
        <div className="flex justify-between items-center p-4">
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
          {/* <CustomPagination
            meta={data?.response?.meta || { total: 0, currentPage: 0 }}
            handleNextPage={setNextPage}
            handlePrevPage={setPrevPage}
            handlePageSizeChange={setPerPage}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            total={data?.response?.meta.lastPage || 0}
          /> */}
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
