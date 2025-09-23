import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
import { TransactionHistory } from './transactionHistory';
import { useProjectBeneficiaryDetail } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';
import React from 'react';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';

export default function BeneficiaryDetailsView() {
  const { id: projectUUID, beneficiaryId } = useParams() as {
    id: UUID;
    beneficiaryId: UUID;
  };
  const { clickToCopy, copyAction } = useCopy();

  const { data: ben, isLoading } = useProjectBeneficiaryDetail({
    projectUUID,
    uuid: beneficiaryId,
  });

  const cardData = [
    { label: 'Available Balance', value: '1200' },
    { label: 'Disbursed Amount', value: '1200' },
    { label: 'Off-ramped Amount', value: '1200' },
  ];

  const steps = [
    { label: 'Onboarding', time: '3:35:00 PM', status: 'done' },
    { label: 'Wallet Creation', time: '3:35:00 PM', status: 'done' },
    { label: 'Disbursement Initiation', time: '3:35:00 PM', status: 'done' },
    { label: 'Approval Process', time: '3:35:00 PM', status: 'done' },
    { label: 'Disbursement Execution', time: '3:35:00 PM', status: 'done' },
    { label: 'SMS Notification', time: 'Pending', status: 'pending' },
    { label: 'Offramping', time: 'Pending', status: 'pending' },
  ];

  const completedSteps = steps.filter((s) => s.status === 'done').length;
  const progress = (completedSteps / steps.length) * 100;
  return (
    <div className="p-4 space-y-4 bg-gray-50">
      <Heading
        title="Beneficiary Details"
        description="Detailed view of the selected beneficiary"
        backBtn
        path={`/projects/aidlink/${projectUUID}/beneficiary?tab=beneficiary`}
      />

      <div className="p-4 border rounded-sm">
        <h4 className="text-xs/6 font-bold spacing text-gray-900 tracking-wider mb-5">
          PERSONAL INFORMATION
        </h4>

        {!isLoading ? (
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <h6 className="text-[10px]/4 font-semibold text-gray-500 tracking-widest">
                BENEFICIARY NAME
              </h6>
              <p className="text-[#3D3D51]">{ben?.piiData?.name || 'N/A'}</p>
              <Badge className="bg-green-50 text-green-600 border-green-500 text-xs">
                Active
              </Badge>
            </div>
            <div>
              <h6 className="text-[10px]/4 font-semibold text-gray-500 tracking-widest">
                PHONE NUMBER
              </h6>
              <p className="text-[#3D3D51]">{ben?.piiData?.phone || 'N/A'}</p>
            </div>
            <div>
              <h6 className="text-[10px]/4 font-semibold text-gray-500 tracking-widest">
                WALLET ADDRESS
              </h6>
              <div className="flex items-center gap-2">
                <p className="text-[#3D3D51]">
                  {ben?.walletAddress
                    ? truncateEthAddress(ben?.walletAddress)
                    : 'N/A'}
                </p>

                <BadgeCheck className="text-primary" size={18} />
                <button
                  onClick={() => clickToCopy(ben?.walletAddress || '', 1)}
                >
                  {copyAction === 1 ? (
                    <CopyCheck className="text-primary" size={18} />
                  ) : (
                    <Copy className="text-primary" size={18} />
                  )}
                </button>
                <ExternalLink className="text-primary" size={18} />
              </div>
            </div>
            <div>
              <h6 className="text-[10px]/4 font-semibold text-gray-500 tracking-widest">
                ADDRESS
              </h6>
              <p className="text-[#3D3D51]">
                {ben?.projectData?.location || 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <SpinnerLoader />
        )}

        <Button
          variant="outline"
          className="rounded-full border border-primary text-primary hover:bg-blue-50 h-6 font-semibold text-[10px]/4 tracking-widest"
        >
          <Eye className="mr-2 h-4 w-4" />
          VIEW BENEFICIARY DOCUMENTS
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {cardData?.map((item, index) => (
          <div key={index} className="rounded-sm bg-card p-4 shadow border">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-sm/6 font-medium">{item.label}</h1>
              <Coins className="text-gray-500" size={18} strokeWidth={2.5} />
            </div>
            <p className="text-primary font-semibold text-xl">{item.value}</p>
          </div>
        ))}
      </div>

      <TransactionHistory />

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

          {/* Progress bar */}
          <Progress value={progress} className="h-2 mb-6" />

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-6 text-center">
            {steps.map((step) => (
              <div key={step.label}>
                {step.status === 'done' ? (
                  <CheckCircle className="mx-auto h-6 w-6 text-green-600" />
                ) : (
                  <Clock className="mx-auto h-6 w-6 text-yellow-500" />
                )}
                <p className="mt-1 text-sm font-medium">{step.label}</p>
                <p className="text-xs text-gray-500">{step.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
