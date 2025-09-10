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

type IProps = {
  type: DisbursementSelectionType | null;
};

export default function CreateDisbursementMain({ type }: IProps) {
  const { id: projectUUID } = useParams() as { id: UUID };

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
    await disburseMultiSig.mutateAsync({
      projectUUID,
      amount,
      disbursementType: type!,
      beneficiaryAddresses: beneficiaries,
      beneficiaryGroup,
      details,
    });
  };

  return type === DisbursementSelectionType.INDIVIDUAL ? (
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
  ) : null;
}
