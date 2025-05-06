'use client';
import { useInfoByCurrentChain } from 'apps/rahat-ui/src/hooks/use-info-by-current-chain';
import { CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import { useAccount } from 'wagmi';

const Confirm = () => {
  const { id } = useParams();

  const searchParams = useSearchParams();
  const { address } = useAccount();
  const chainInfo = useInfoByCurrentChain();

  const amount = Number(searchParams.get('amount'));
  const source = searchParams.get('source');
  const beneficiary = Number(searchParams.get('beneficiary'));
  const from = searchParams.get('from');
  const disbursementUuid = searchParams.get('disbursementUuid');
  const safeTxHash = searchParams.get('safeTxHash');

  return (
    <>
      <div className="flex items-center gap-2 m-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Disburse USDC to Beneficiaries
        </h1>
      </div>
      <div className="bg-card rounded-lg m-4 p-4">
        <div className="mt-8 mb-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
              <p className="text-lg font-medium text-gray-700 mt-4">
                You have successfully sent request for disbursement of
              </p>
              <p className="text-lg font-medium text-gray-700">
                <strong>{amount * beneficiary} USDC</strong> : {amount} USDC
                each to {beneficiary} Beneficiaries from{' '}
                {source === 'MULTISIG'
                  ? 'this'
                  : source === 'PROJECT'
                  ? `c2c Project Balance`
                  : `your wallet ${address}`}
              </p>
              {source === 'MULTISIG' && (
                <>
                  <p>'Gnosis A/C' : </p>
                  <Link
                    className="text-blue-500 font-medium underline mt-2"
                    href={`${chainInfo.safeURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {from}
                  </Link>
                  <p className="text-sm text-gray-500 mt-4">
                    Please contact your Gnosis A/C holder for the release of the
                    token
                  </p>
                </>
              )}
              <Link
                className="mt-6 bg-blue-100 text-blue-500 py-2 px-8 rounded-md inline-block"
                href={`/projects/c2c/${id}/disbursement/${disbursementUuid}`}
              >
                View Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;
