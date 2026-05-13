import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import React from 'react';
import { Copy, CopyCheck, Store, User } from 'lucide-react';
import HeaderWithBack from '../../components/header.with.back';
import { useParams, useSearchParams } from 'next/navigation';
import { UUID } from 'crypto';
import { mapStatus } from '@rahat-ui/query';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

function formatDetailDate(value: string): string {
  if (!value || value === '-') return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function BeneficiaryDetail() {
  const { id } = useParams() as { id: UUID; benId: UUID };
  const [walletAddressCopied, setWalletAddressCopied] =
    React.useState<string>();

  const searchParams = useSearchParams();
  const phone = decodeURIComponent(searchParams.get('phone') || '');
  const consent = searchParams.get('consent');
  const name = searchParams.get('name');
  const walletAddress = searchParams.get('walletAddress') || '';
  const gender = searchParams.get('gender') || '';
  const voucherType = searchParams.get('voucherType') || '';
  const voucherStatus = searchParams.get('voucherStatus') || '';
  const eyeCheckupStatus = searchParams.get('eyeCheckupStatus') || '';
  const age = searchParams.get('age');
  const createdAtRaw = searchParams.get('createdAt') || '-';

  const clickToCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setWalletAddressCopied(addr);
  };

  return (
    <div className="min-h-[calc(100vh-95px)] p-4">
      <div className="mb-6">
        <HeaderWithBack
          title="Consumer details"
          subtitle="Profile and voucher status for this consumer"
          path={`/projects/el-wom/${id}/beneficiary`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 max-w-6xl">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-muted p-3">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <CardTitle className="text-xl truncate">{phone || '—'}</CardTitle>
                <CardDescription>
                  Onboarded {formatDetailDate(createdAtRaw)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Wallet</p>
              <button
                type="button"
                className="flex items-center gap-2 text-left hover:text-primary transition-colors"
                onClick={() => clickToCopy(walletAddress)}
              >
                <span className="font-mono text-sm">
                  {walletAddress
                    ? truncateEthAddress(walletAddress)
                    : '—'}
                </span>
                {walletAddressCopied === walletAddress ? (
                  <CopyCheck size={16} strokeWidth={1.5} />
                ) : (
                  <Copy className="text-muted-foreground" size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Age</span>
                <p className="font-medium">{age || '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Gender</span>
                <p className="font-medium">{gender || '—'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2 border-t">
              <Store className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Vendor</p>
                <p className="font-medium">{name || '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Voucher usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {mapStatus(eyeCheckupStatus) || '—'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Voucher status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {mapStatus(voucherStatus) || '—'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Glass type</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {mapStatus(voucherType) || '—'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Consent</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-sm">
              {mapStatus(consent || '-') || '—'}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
