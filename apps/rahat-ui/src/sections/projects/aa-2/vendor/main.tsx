import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Heading } from 'apps/rahat-ui/src/common';
import { useActiveTab } from 'apps/rahat-ui/src/utils/useActivetab';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { VendorList } from './tabs/vendor.list';
import { VendorRedemptionList } from './tabs/vendor.redemption.list';

export default function VendorsView() {
  const { id } = useParams() as { id: UUID };
  const { activeTab, setActiveTab } = useActiveTab('vendorList');

  return (
    <>
      <div className="p-4">
        <Heading
          title="Vendors"
          description="Track all the vendor reports here"
        />

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border bg-secondary rounded">
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="vendorList"
            >
              Vendor List
            </TabsTrigger>
            <TabsTrigger
              className="w-full data-[state=active]:bg-white"
              value="vendorRedemptionList"
            >
              Vendor Redemption List
            </TabsTrigger>
          </TabsList>
          <TabsContent value="vendorList">
            <VendorList id={id} />
          </TabsContent>
          <TabsContent value="vendorRedemptionList">
            <VendorRedemptionList id={id} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
