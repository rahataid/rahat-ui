import {
  Card,
  CardContent,
  CardDescription,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils';

interface IVendorsInfo {
  vendorData: {
    name: string | null;
    phone: string | null;
    vendorWallet: string | null;
  };
}

const VendorsInfo = ({ vendorData }: IVendorsInfo) => {
  const { name, phone, vendorWallet } = vendorData;
  return (
    <>
      <Card className="mt-2 rounded shadow">
        <div className="mt-3">
          <CardContent>
            <p className="text-primary">{name || 'Name N/A'}</p>
            <CardDescription>
              {vendorWallet
                ? vendorWallet.slice(0, 10) + '...' + vendorWallet.slice(-10)
                : '-'}
            </CardDescription>
          </CardContent>
          <CardContent>
            <p className="text-primary">{phone || '-'}</p>
            <CardDescription>Phone</CardDescription>
          </CardContent>
        </div>
      </Card>
    </>
  );
};

export default VendorsInfo;
