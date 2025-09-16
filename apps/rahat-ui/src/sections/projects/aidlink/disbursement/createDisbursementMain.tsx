import { useParams } from 'next/navigation';
import { BeneficiaryDisbursementForm } from './beneficiaryDisbursementForm';
import { BeneficiaryGroupsDisbursementForm } from './groupsDisbursementForm';
import { UUID } from 'crypto';
import {
  DisbursementSelectionType,
  useDisburseTokenUsingMultisig,
  useFindC2CBeneficiaryGroups,
  useProjectBeneficiaries,
} from '@rahat-ui/query';
import { TransactionInitiatedModal } from './transactionInitiatedModal';
import React from 'react';

type IProps = {
  type: DisbursementSelectionType | null;
};

export default function CreateDisbursementMain({ type }: IProps) {
  const { id: projectUUID } = useParams() as { id: UUID };

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [disbursementResult, setDisbursementResult] = React.useState<any>(null);

  const disburseMultiSig = useDisburseTokenUsingMultisig();

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
    (group: any) => group._count.groupedBeneficiaries > 0,
  );

  const handleCreateDisbursement = async ({
    beneficiaries,
    beneficiaryGroup,
    amount,
    details,
  }: {
    beneficiaries?: `0x${string}`[];
    beneficiaryGroup?: UUID;
    amount: string;
    details?: string;
  }) => {
    const result = await disburseMultiSig.mutateAsync({
      projectUUID,
      amount,
      disbursementType: type!,
      beneficiaryAddresses: beneficiaries,
      beneficiaryGroup,
      details,
    });

    if (result) {
      setDisbursementResult(result);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <TransactionInitiatedModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={disbursementResult}
      />
      {type === DisbursementSelectionType.INDIVIDUAL ? (
        <BeneficiaryDisbursementForm
          beneficiaries={projectBeneficiaries?.data}
          isLoading={isLoadingBeneficiaries}
          handleDisbursement={(beneficiaries, amount, details) =>
            handleCreateDisbursement({
              beneficiaries,
              amount,
              details,
            })
          }
        />
      ) : type === DisbursementSelectionType.GROUP ? (
        <BeneficiaryGroupsDisbursementForm
          groups={validGroups}
          isLoading={isLoadingGroups}
          handleDisbursement={(beneficiaryGroup, amount, details) =>
            handleCreateDisbursement({
              beneficiaryGroup,
              amount,
              details,
            })
          }
        />
      ) : null}
    </>
  );
}
