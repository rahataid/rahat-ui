'use client';
import { useBeneficiaryStore, useSingleBeneficiary } from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { UUID } from 'crypto';
import { Copy, CopyCheck, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import CoreBtnComponent from '../../components/core.btn';
import HeaderWithBack from '../projects/components/header.with.back';
import { humanizeString } from '../../utils';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function BeneficiaryDetail() {
  const { id } = useParams() as { id: UUID };
  const router = useRouter();

  const searchParams = useSearchParams();

  const projectId = searchParams.get('projectId');
  const groupId = searchParams.get('groupId');
  const txnDetailsId = searchParams.get('txnDetailsId');

  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();
  useSingleBeneficiary(id as UUID);
  const beneficiary = useBeneficiaryStore((state) => state.singleBeneficiary);
  const t = useTranslations('Beneficiary Detail');
  const g = useTranslations('GLOBAL');

  const clickToCopy = (walletAddress: string) => {
    navigator.clipboard.writeText(walletAddress);
    setWalletAddressCopied(walletAddress);
  };

  const routePath =
    projectId && txnDetailsId && groupId
      ? `/projects/aa/${projectId}/payout/transaction-details/${txnDetailsId}?groupId=${groupId}`
      : `/beneficiary`;
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <HeaderWithBack
          title={t('BENEFICIARY_DETAILS')}
          subtitle={t('HERE_IS_A_DETAILED_VIEW_OF')}
          path={routePath}
        />
        <div className="flex space-x-2">
          {/* <CoreBtnComponent
            className="text-primary bg-sky-50"
            name="Assign to Project"
            Icon={FolderPlus}
            handleClick={() => {}}
          /> */}
          <CoreBtnComponent
            name={g('EDIT')}
            Icon={Pencil}
            handleClick={() => {
              router.push(`/beneficiary/${id}/edit`);
            }}
          />
          <CoreBtnComponent
            className="bg-red-100 text-red-600"
            name={g('DELETE')}
            Icon={Trash2}
            handleClick={() => {}}
          />
        </div>
      </div>
      <h1 className="font-medium mb-3">{g('GENERAL')}</h1>
      <div className="p-5 rounded-sm shadow border grid grid-cols-4 gap-5">
        <div>
          <h1 className="text-md text-muted-foreground">{g('BENEFICIARY_NAME')}</h1>
          <p className="font-medium">{beneficiary?.piiData?.name || g('N_A')}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('GENDER')}</h1>
          <p className="font-medium">{beneficiary?.gender ?? g('N_A')}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('ESTIMATED_AGE')}</h1>
          <p className="font-medium">{beneficiary?.age ?? g('N_A')}</p>
        </div>

        <div>
          <h1 className="text-md text-muted-foreground">{g('ADDRESS')}</h1>
          <p className="font-medium">{beneficiary?.location ?? g('N_A')}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('PHONE_NUMBER')}</h1>
          <p className="font-medium">{beneficiary?.piiData?.phone ?? g('N_A')}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('EMAIL_ADDRESS')}</h1>
          <p className="font-medium">{beneficiary?.piiData?.email ?? g('N_A')}</p>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('PHONE_STATUS')}</h1>
          <Badge>{beneficiary?.phoneStatus ?? g('N_A')}</Badge>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{t('BANK_STATUS')}</h1>
          <Badge>{beneficiary?.bankedStatus ?? g('N_A')}</Badge>
        </div>
        <div>
          <h1 className="text-md text-muted-foreground">{g('INTERNET_STATUS')}</h1>
          <Badge>{beneficiary?.internetStatus ?? g('N_A')}</Badge>
        </div>

        {/* <div>
          <h1 className="text-md text-muted-foreground">Wallet</h1>
          <Badge>{beneficiary?.walletAddress ?? 'N/A'}</Badge>
        </div> */}

        <div>
          <h1 className="text-md text-muted-foreground">{g('WALLET_ADDRESS')}</h1>
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => clickToCopy(beneficiary?.walletAddress as string)}
          >
            <Badge className="truncate w-32">
              {beneficiary?.walletAddress ?? g('N_A')}
            </Badge>

            {walletAddressCopied === beneficiary?.walletAddress ? (
              <CopyCheck size={15} strokeWidth={1.5} />
            ) : (
              <Copy className="text-slate-500" size={15} strokeWidth={1.5} />
            )}
          </div>
        </div>
      </div>

      <div
        className={`mt-3 flex flex-col space-y-4  ${
          beneficiary?.BeneficiaryProject &&
          beneficiary?.BeneficiaryProject.length < 1 &&
          'hidden'
        }`}
      >
        <p className="text-base font-medium">{t('PROJECT_INVOLVED')}</p>

        <div className="p-5 rounded-sm shadow border flex flex-wrap gap-5">
          {beneficiary?.BeneficiaryProject?.map((item, index) => (
            <Badge
              key={item.id || index}
              className="text-muted-foreground text-base inline-flex w-auto max-w-max"
            >
              {item.Project?.name || '-'}
            </Badge>
          ))}
        </div>
      </div>

      {Object.keys(beneficiary?.extras || {}).length > 0 &&
        beneficiary?.extras && (
          <div className="mt-3 space-y-3">
            <h1 className="font-medium">{t('EXTRA_DETAILS')}</h1>
            <div className="p-5 rounded-sm shadow border grid grid-cols-4 gap-5">
              {Object.entries(beneficiary.extras)
                .filter(([key]) => {
                  const cleanKey = key.trim().toLowerCase();
                  return ![
                    'error',
                    'bankedstatus',
                    'validbankaccount',
                    'token',
                  ].includes(cleanKey);
                })
                .map(([key, value]) => (
                  <div key={key} className="col-span-1">
                    <p>{String(value)}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {humanizeString(key)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
}
