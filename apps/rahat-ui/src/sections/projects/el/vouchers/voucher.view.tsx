'use client';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { useProjectVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useParams } from 'next/navigation';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';
import AddVoucher from './add.voucher';
import { DiscountHoldersTable } from './discount.holder.table';
import { DiscountTransactionTable } from './discount.transactions.table';
import DiscountVoucherInfo from './discount.voucher.info';
import { FreeHoldersTable } from './free.holder.table';
import { FreeTransactionTable } from './free.transactions.table';
import FreeVoucherInfo from './free.voucher.info';
import { useReadElProjectGetProjectVoucherDetail } from 'apps/rahat-ui/src/hooks/el/contracts/elProject';

const VoucherView = () => {
  const { id } = useParams();

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const { data: projectVoucher, isLoading } = useProjectVoucher(
    contractSettings?.elproject?.address || '',
    contractSettings?.eyevoucher?.address || '',
  );

  const { data: voucherDetails } = useReadElProjectGetProjectVoucherDetail({
    address: contractSettings?.elproject?.address || '',
  });

  const voucherData = {...voucherDetails,...projectVoucher}

  console.log(voucherDetails)
  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <TableLoader />
        </div>
      ) : (
        <>
          {voucherDetails?.eyeVoucherBudget >= BigInt(1)  ? (
            <div className="bg-secondary">
              <div className="grid grid-cols-2">
                <div>
                  <FreeVoucherInfo data={voucherData} />
                </div>
                <div>
                  <DiscountVoucherInfo data={voucherData} />
                </div>
              </div>

              <div className="mt-2 mx-2">
                <Tabs defaultValue="free">
                  <TabsList className="w-full grid grid-cols-2 border h-auto">
                    <TabsTrigger value="free">
                      Free Vouchers Transaction History
                    </TabsTrigger>
                    <TabsTrigger value="discount">
                      Discount Vouchers Transaction History
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="free">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2 h-full">
                        <FreeTransactionTable />
                      </div>
                      <div>
                        <FreeHoldersTable />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="discount">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <DiscountTransactionTable />
                      </div>
                      <div>
                        <DiscountHoldersTable />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <AddVoucher contractSettings={contractSettings} />
          )}
        </>
      )}
    </>
  );
};

export default VoucherView;
