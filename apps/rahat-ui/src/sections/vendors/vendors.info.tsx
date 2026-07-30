import { useTranslations } from 'next-intl';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import {
  Card,
  CardContent,
  CardDescription,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import { CopyCheck, Copy } from 'lucide-react';

interface IVendorsInfo {
  vendorData: {
    name: string | null;
    phone: string | null;
    vendorWALLET: string | null;
    vendorWALLETAddressCopied: boolean;
    vendorStatus: boolean;
    clickToCopy: () => void;
  };
}

const VendorsInfo = ({ vendorData }: IVendorsInfo) => {
  const t = useTranslations('VENDORS_INFO_CARD');
  const g = useTranslations('GLOBAL');
  const { name, phone, vendorWALLET, vendorStatus } = vendorData;
  return (
    <>
      <Card className="mt-2 rounded shadow">
        <div className="mt-3">
          <CardContent>
            <p className="text-primary">{name || t('NAME_NA')}</p>
            <div className="flex items-center gap-3">
              <CardDescription className="flex items-center gap-1">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger
                      className="flex items-center gap-1"
                      onClick={vendorData.clickToCopy}
                    >
                      <p className="text-muted-foreground text-base">
                        {vendorWALLET
                          ? vendorWALLET.slice(0, 10) +
                            '...' +
                            vendorWALLET.slice(-10)
                          : '-'}
                      </p>
                      {vendorData?.vendorWALLETAddressCopied ? (
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
                        {vendorData.vendorWALLETAddressCopied
                          ? g('COPIED')
                          : g('CLICK_TO_COPY')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardDescription>
            </div>
          </CardContent>
          <CardContent className="flex items-center gap-5">
            {/* <div >
          <p className="text-primary flex items-center ">{phone|| '-'}</p>
          <CardDescription>Phone</CardDescription>
        </div> */}
            <div>
              <p className="text-primary">
                {vendorStatus ? t('APPROVED') : t('NOT_APPPROVED')}
              </p>
              <CardDescription>{g('STATUS')}</CardDescription>
            </div>
          </CardContent>
        </div>
      </Card>
    </>
  );
};

export default VendorsInfo;
