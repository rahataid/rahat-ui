import { useParams } from 'next/navigation';
import { BeneficiaryDisbursementForm } from './beneficiaryDisbursementForm';
import { BeneficiaryGroupsDisbursementForm } from './groupsDisbursementForm';
import { UUID } from 'crypto';
import {
  DisbursementSelectionType,
  useDisburseTokenUsingMultisig,
  useFindC2CBeneficiaryGroups,
  useProjectBeneficiaries,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { TransactionInitiatedModal } from './transactionInitiatedModal';
import React from 'react';
import { SAFE_WALLET } from 'apps/rahat-ui/src/constants/safeWallet';
import { SpinnerLoader } from 'apps/rahat-ui/src/common';

type IProps = {
  type: DisbursementSelectionType | null;
};

export default function CreateDisbursementMain({ type }: IProps) {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [disbursementResult, setDisbursementResult] = React.useState<any>(null);

  const disburseMultiSig = useDisburseTokenUsingMultisig();

  const safeWallet = useProjectSettingsStore(
    (state) => state?.settings?.[projectUUID]?.['SAFE_WALLET']?.address,
  );

  const chainSettings = useProjectSettingsStore(
    (state) => state?.settings?.[projectUUID]?.['BLOCKCHAIN'],
  );

  const safeNetwork = SAFE_WALLET[Number(chainSettings.chainid)];

  const { data: projectBeneficiaries, isLoading: isLoadingBeneficiaries } =
    useProjectBeneficiaries({
      page: 1,
      perPage: 9999,
      order: 'desc',
      sort: 'createdAt',
      projectUUID,
    });

  const { data: groups, isLoading: isLoadingGroups } =
    useFindC2CBeneficiaryGroups(projectUUID, {
      page: 1,
      perPage: 9999,
      order: 'desc',
      sort: 'createdAt',
      projectUUID,
    });

  const validGroups = groups?.filter(
    (group: any) =>
      group?._count?.groupedBeneficiaries || group?.totalBeneficiaries > 0,
  );

  const handleCreateDisbursement = async ({
    beneficiaries,
    beneficiaryGroup,
    amount,
    totalAmount,
    details,
  }: {
    beneficiaries?: `0x${string}`[];
    beneficiaryGroup?: UUID;
    amount: string;
    totalAmount?: string;
    details?: string;
  }) => {
    const result = await disburseMultiSig.mutateAsync({
      projectUUID,
      amount,
      disbursementType: type!,
      beneficiaryAddresses: beneficiaries,
      beneficiaryGroup,
      totalAmount,
      details,
    });

    if (result) {
      setDisbursementResult(result);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {disburseMultiSig.isPending && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/50">
          <SpinnerLoader className="w-10 h-10" />
        </div>
      )}
      <TransactionInitiatedModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={disbursementResult}
        safeNetwork={safeNetwork}
        safeAddress={safeWallet}
      />
      {type === DisbursementSelectionType.INDIVIDUAL ? (
        <BeneficiaryDisbursementForm
          beneficiaries={projectBeneficiaries?.data}
          isLoading={isLoadingBeneficiaries}
          handleDisbursement={(beneficiaries, amount, totalAmount, details) =>
            handleCreateDisbursement({
              beneficiaries,
              amount,
              totalAmount,
              details,
            })
          }
          isSubmitting={disburseMultiSig.isPending}
        />
      ) : type === DisbursementSelectionType.GROUP ? (
        <BeneficiaryGroupsDisbursementForm
          groups={validGroups}
          isLoading={isLoadingGroups}
          handleDisbursement={(
            beneficiaryGroup,
            amount,
            totalAmount,
            details,
          ) =>
            handleCreateDisbursement({
              beneficiaryGroup,
              amount,
              totalAmount,
              details,
            })
          }
          isSubmitting={disburseMultiSig.isPending}
        />
      ) : null}
    </>
  );
}
