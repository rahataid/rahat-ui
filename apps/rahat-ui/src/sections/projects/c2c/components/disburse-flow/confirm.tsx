import { CheckCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const Confirm = () => {
  const { id } = useParams();
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
                <strong>400 USDC</strong> : 100 USDC each to 4 Beneficiaries
                from this
              </p>
              Gnosis A/C :{' '}
              <Link
                className="text-blue-500 font-medium underline mt-2"
                href="/gnosis-account"
              >
                x23121sd321cdq
              </Link>
              <p className="text-sm text-gray-500 mt-4">
                Please contact your Gnosis A/C holder for the release of the
                token
              </p>
              <Link
                className="mt-6 bg-blue-50 text-blue-500 py-2 px-4 rounded-md inline-block"
                href={`/projects/c2c/${id}/disbursements`}
              >
                View Disbursement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm;
