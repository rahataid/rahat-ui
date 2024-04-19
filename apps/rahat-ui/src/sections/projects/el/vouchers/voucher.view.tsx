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
import AddVoucher from './add.voucher';
import { DiscountHoldersTable } from './discount.holder.table';
import { DiscountTransactionTable } from './discount.transactions.table';
import DiscountVoucherInfo from './discount.voucher.info';
import { FreeHoldersTable } from './free.holder.table';
import { FreeTransactionTable } from './free.transactions.table';
import FreeVoucherInfo from './free.voucher.info';

const VoucherView = () => {
  const { id } = useParams();

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const { data: projectVoucher, isLoading } = useProjectVoucher(
    contractSettings?.elproject?.address || '',
    contractSettings?.eyevoucher?.address || '',
  );

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-5 w-5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
            <div className="h-5 w-5 animate-bounce rounded-full bg-primary [animation-delay:-0.13s]"></div>
            <div className="h-5 w-5 animate-bounce rounded-full bg-primary"></div>
          </div>
        </div>
      ) : (
        <>
          {projectVoucher?.freeVoucherAddress ? (
            <>
              <FreeVoucherInfo data={projectVoucher} />
              <DiscountVoucherInfo data={projectVoucher} />

              <div className="m-2">
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
            </>
          ) : (
            <AddVoucher contractSettings={contractSettings} />
          )}
        </>
      )}
    </>
  );
};

export default VoucherView;
