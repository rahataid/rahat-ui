'use client';

import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { DetailRow } from './gct.ui';

// ─── DisbursementInfoCard ─────────────────────────────────────────────────────
// Renders post-disbursement details from disbursementInfo response.
// Derives fields from nested offrampRequest / transaction paths.

export function DisbursementInfoCard({ info, txUrl }: { info: any; txUrl?: string | null }) {
  const tx = info?.result?.transaction;
  const batch = tx?.cipsBatchResponse;
  const cipsTxnMsg = tx?.cipsTxnResponseList?.[0]?.responseMessage;
  const payment = info?.result?.offrampRequest?.paymentDetails ?? tx?.paymentDetails;
  const offramp = info?.result?.offrampStatus ?? info?.offrampStatus;
  const txHash = info?.result?.offrampRequest?.transactionHash ?? tx?.txHash ?? info?.txHash;
  const disbursedBy = info?.disbursedBy;
  const error = info?.error;

  const rows: [string, string][] = ([
    ['Disbursed By', disbursedBy],
    ['Batch Response', batch?.responseMessage],
    ['CIPS Txn Response', cipsTxnMsg],
    ['Offramp Status', offramp],
    ['Amount', payment?.amount != null ? String(payment.amount) : undefined],
  ] as [string, string | undefined][]).filter(([, v]) => v != null) as [string, string][];

  if (!rows.length && !txHash && !error) return null;

  return (
    <Card className="rounded-sm mt-4">
      <CardContent className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Disbursement Info
        </p>
        {txHash && (
          <div className="flex flex-col gap-0.5 py-2.5 border-b">
            <span className="text-xs text-muted-foreground">Transaction Hash</span>
            {txUrl ? (
              <a
                href={txUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono break-all text-blue-600 hover:underline"
              >
                {txHash}
              </a>
            ) : (
              <span className="text-sm font-mono break-all">{txHash}</span>
            )}
          </div>
        )}
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} />
        ))}
        {error && <DetailRow label="Error" value={error} />}
      </CardContent>
    </Card>
  );
}
