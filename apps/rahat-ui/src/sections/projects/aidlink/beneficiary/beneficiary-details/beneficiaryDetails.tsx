import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Progress } from '@rahat-ui/shadcn/src/components/ui/progress';
import { Heading, SpinnerLoader } from 'apps/rahat-ui/src/common';
import {
  BadgeCheck,
  CheckCircle,
  Clock,
  Coins,
  Copy,
  CopyCheck,
  ExternalLink,
  Eye,
} from 'lucide-react';
import {
  useGetBenefDisbursementDetails,
  useProjectBeneficiaryDetail,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import React, { useMemo } from 'react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import TrasactionInfoSection from './trasactionInfo-section';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import Loader from 'apps/community-tool-ui/src/components/Loader';

export default function BeneficiaryDetailsView() {
  const { copyAction, clickToCopy } = useCopy();
  const { id: projectUUID, beneficiaryId } = useParams() as {
    id: UUID;
    beneficiaryId: UUID;
  };

  const { data: ben, isLoading } = useProjectBeneficiaryDetail({
    projectUUID,
    uuid: beneficiaryId,
  });

  const { data: disbursementDetails, isLoading: loading } =
    useGetBenefDisbursementDetails(projectUUID, beneficiaryId);

  const totolDisburbeAmout = useMemo(() => {
    return disbursementDetails?.allDisbursements?.reduce(
      (sum: number, curr: any) => sum + Number(curr?.amount),
      0,
    );
  }, [disbursementDetails]);

  const steps = useMemo(
    () => [
      {
        label: 'Onboarding',
        date: ben?.projectData?.updatedAt || '',
        status: ben?.projectData?.updatedAt ? 'done' : 'Pending',
      },
      {
        label: 'Wallet Creation',
        date: ben?.projectData?.updatedAt || '',
        status: ben?.projectData?.updatedAt ? 'done' : 'pending',
      },
      {
        label: 'Disbursement Initiation',
        date: disbursementDetails?.latestDisbursementDate,
        status: disbursementDetails?.latestDisbursementDate
          ? 'done'
          : 'pending',
      },
      { label: 'Approval Process', date: '', status: 'pending' },
      { label: 'Disbursement Execution', date: '', status: 'pending' },
      // { label: 'SMS Notification', date: '', status: 'pending' },
      { label: 'Offramping', date: '', status: 'pending' },
    ],
    [ben],
  );

  const completedSteps = steps.filter((s) => s.status === 'done').length;
  const progress = (completedSteps / steps.length) * 100;
  return (
      <div className="p-4 space-y-4 bg-gray-50">
        {/* Header */}
        <Heading
          title="Beneficiary Details"
          description="Detailed view of the selected beneficiary"
          backBtn
          path={`/projects/aidlink/${projectUUID}/beneficiary?tab=beneficiary`}
        />

        {/* Personal Information */}
        <div className="p-4 border rounded-sm">
          <h4 className="text-xs font-bold tracking-wider text-gray-900 mb-5">
            PERSONAL INFORMATION
          </h4>

          {!isLoading ? (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Beneficiary Name */}
              <div>
                <h6 className="text-[10px] font-semibold text-gray-500 tracking-widest">
                  BENEFICIARY NAME
                </h6>
                <p className="text-[#3D3D51]">{ben?.piiData?.name || 'N/A'}</p>
                <Badge className="bg-green-50 text-green-600 border-green-500 text-xs">
                  Active
                </Badge>
              </div>

              {/* Phone Number */}
              <div>
                <h6 className="text-[10px] font-semibold text-gray-500 tracking-widest">
                  PHONE NUMBER
                </h6>
                <p className="text-[#3D3D51]">{ben?.piiData?.phone || 'N/A'}</p>
              </div>

              {/* Wallet Address */}
              <div>
                <h6 className="text-[10px] font-semibold text-gray-500 tracking-widest">
                  WALLET ADDRESS
                </h6>
                <div className="flex items-center gap-2">
                  <p className="text-[#3D3D51]">
                    {ben?.walletAddress
                      ? truncateEthAddress(ben.walletAddress)
                      : 'N/A'}
                  </p>

                  {/* Verified Badge */}
                  <BadgeCheck className="text-primary" size={18} />

                  {/* Copy to Clipboard Button */}
                  <button
                    onClick={() => clickToCopy(ben?.walletAddress || '', 1)}
                  >
                    {copyAction === 1 ? (
                      <CopyCheck className="text-primary" size={18} />
                    ) : (
                      <Copy className="text-primary" size={18} />
                    )}
                  </button>

                  {/* External Link */}
                  <ExternalLink
                    className="text-primary cursor-pointer"
                    size={18}
                  />
                </div>
              </div>
            </div>
          ) : (
            <SpinnerLoader />
          )}
        </div>

        {/* Card Data Grid and transaction history */}
        <TrasactionInfoSection
          totolDisburbeAmout={totolDisburbeAmout}
          walletAddress={ben?.walletAddress || ''}
        />

        {/* Transaction Lifecycle Overview */}
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  TRANSACTION LIFECYCLE OVERVIEW
                </p>
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-200"
                >
                  In Progress
                </Badge>
              </div>
              <p className="text-sm font-medium">
                {Math.round(progress)}% Complete
              </p>
            </div>

            {/* Steps */}
            {isLoading || loading ? (
              <>
                <Loader />
              </>
            ) : (
              <>
                {/* Progress Bar */}
                <Progress
                  value={progress}
                  indicatorColor="bg-blue-500"
                  className="h-2 mb-6"
                />
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
                  {steps.map((step, index) => (
                    <div key={index}>
                      {step.status === 'done' ? (
                        <>
                          <CheckCircle className="mx-auto h-6 w-6 text-green-600" />
                          <p className="mt-1 text-sm font-medium">
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {dateFormat(step.date)}
                          </p>
                        </>
                      ) : (
                        <>
                          <Clock className="mx-auto h-6 w-6 text-yellow-500" />
                          <p className="mt-1 text-sm font-medium">
                            {step.label}
                          </p>
                          <p className="text-xs capitalize text-gray-500">
                            {step.status}
                          </p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
