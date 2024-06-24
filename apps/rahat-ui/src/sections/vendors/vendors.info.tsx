import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import {
  Card,
  CardContent,
  CardDescription,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { CopyCheck, Copy } from 'lucide-react';

interface IVendorsInfo {
  vendorData: {
    name: string | null;
    phone: string | null;
    vendorWallet: string | null;
    vendorWalletAddressCopied:Boolean
    clickToCopy:()=>void
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
        <div className="flex items-center gap-3">
          <CardDescription className="flex items-center gap-1">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="flex items-center gap-1"
                  onClick={vendorData.clickToCopy}
                >
                  <p className="text-muted-foreground text-base">
                    {vendorWallet
                      ? vendorWallet.slice(0, 10) + '...' + vendorWallet.slice(-10)
                      : '-'}
                  </p>
                  {vendorData?.vendorWalletAddressCopied ? (
                    <CopyCheck size={12} strokeWidth={1.5} />
                  ) : (
                    <Copy
                      className="text-muted-foreground"
                      size={15}
                      strokeWidth={1.5}
                    />
                  )}
                </TooltipTrigger>
                <TooltipContent className="bg-secondary" side="bottom">
                  <p className="text-xs font-medium">
                    {vendorData.vendorWalletAddressCopied ? 'copied' : 'click to copy'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardDescription>
        </div>
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
