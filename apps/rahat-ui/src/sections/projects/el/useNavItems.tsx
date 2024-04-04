import { useProjectSettingsStore } from '@rahat-ui/query';
import {
  useCloseProject,
  useMintVouchers,
  useOnlyMintVoucher,
} from 'apps/rahat-ui/src/hooks/el/contracts/el-contracts';
import { useProjectVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import {
  LayoutDashboard,
  Pencil,
  Receipt,
  ReceiptText,
  Speech,
  Store,
  TicketCheck,
  UsersRound,
  XCircle,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSwal } from '../../../components/swal';
import { NavItem } from '../components';
import ConfirmModal from './confirm.modal';
import CreateVoucherModal from './create-voucher-modal';

export const useNavItems = () => {
  const { id } = useParams();
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id] || null,
  );

  const dialog = useSwal();
  const createTokenSummaryModal = useBoolean();
  const createTokenModal = useBoolean();

  const handleOpenCreateTokenModal = () => {
    createTokenModal.onToggle();
    createTokenSummaryModal.onFalse();
  };
  const handleSubmitCreateTokenModal = (e: any) => {
    e.preventDefault();
    createTokenModal.onFalse();
    createTokenSummaryModal.onTrue();
  };
  const handleBackToCreateTokenModal = () => {
    createTokenSummaryModal.onFalse();
    createTokenModal.onTrue();
  };
  const handleCloseSummaryModal = () => {
    createTokenSummaryModal.onFalse();
  };
  const handleSummaryModal = () => {
    createTokenModal.onToggle();
  };

  const [voucherInputs, setVoucherInputs] = useState({
    tokens: '',
    amountInDollar: '',
    amountInDollarReferral: '',
    description: '',
    descriptionReferred: '',
    currency: '',
    tokenDescription: '',
  });

  const projectVoucher = useProjectVoucher(
    contractSettings?.elProjectAddress || '',
    contractSettings?.eyeVoucherAddress || '',
  );


  useEffect(() => {
    if (projectVoucher.isSuccess) {
      setVoucherInputs((prev) => ({
        ...prev,
      }));
    }
  }, [projectVoucher.isSuccess]);

  const handleCreateVoucherTokenChange = (e: any) => {
    const { name, value } = e.target;

    setVoucherInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createVoucher = useMintVouchers();
  const createOnlyVoucher = useOnlyMintVoucher();
  const closeProject = useCloseProject();

  // Free Voucher
  const handleCreateVoucherSubmit = async (e: any) => {
    e.preventDefault();
    if (!contractSettings) return;
    const referralLimit = 3;
      await createOnlyVoucher.writeContractAsync({
          address: contractSettings?.rahatdonor?.address,
          args: [
            contractSettings?.eyevoucher?.address,
            contractSettings?.referralvoucher?.address,
            contractSettings?.elproject?.address,
            BigInt(voucherInputs.tokens),
            BigInt(referralLimit),
          ],
        });
    handleCloseSummaryModal();
  };

  const handleCloseProject = async () => {
    const { value } = await dialog.fire({
      title: 'Close Project',
      text: "Are you sure you want to close the project? You won't be able to access any project actions",
      showCancelButton: true,
      confirmButtonText: 'Lock',
    });
    if (value) {
      closeProject.writeContractAsync({
        address: '0x9C8Ee9931BEc18EA883c8F23c7427016bBDeF171',
      });
    }
  };

  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      children: [
        {
          title: 'Dashboard',
          path: `/projects/el/${id}`,
          icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Beneficiaries',
          path: `/projects/el/${id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: `/projects/el/${id}/vendors`,
          subtitle: 20,
          icon: <Store size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/el/${id}/transactions`,
          subtitle: 20,
          icon: <Receipt size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Redemptions',
          path: `/projects/el/${id}/redemptions`,
          icon: <TicketCheck size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vouchers',
          path: `/projects/el/${id}/vouchers`,
          icon: <ReceiptText size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Campaigns',
          icon: <Speech size={18} strokeWidth={1.5} />,
          path: `/projects/el/${id}/campaigns/text`,

        },
      ],
    },
    {
      title: 'Actions',
      children: [
        {
          component: (
            <>
              <CreateVoucherModal
                voucherInputs={voucherInputs}
                handleSubmit={handleSubmitCreateTokenModal}
                handleInputChange={handleCreateVoucherTokenChange}
                setVoucherInputs={setVoucherInputs}
                open={createTokenModal.value}
                handleModal={handleOpenCreateTokenModal}
              />
              <ConfirmModal
                open={createTokenSummaryModal.value}
                voucherInputs={voucherInputs}
                handleSubmit={handleCreateVoucherSubmit}
                handleGoBack={handleBackToCreateTokenModal}
                handleClose={handleCloseSummaryModal}
                handleCreateVoucherSubmit={handleCreateVoucherSubmit}
                isLoading={createVoucher.isPending}
              />
            </>
          ),
          title: 'Create Voucher',
        },
        // {
        //   title: 'Lock Project',
        //   icon: <Lock size={18} strokeWidth={1.5} />,
        //   onClick: handleLockProject,
        // },
        {
          title: 'Close Project',
          onClick: handleCloseProject,
          icon: <XCircle size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Edit Project',
          path: '/edit',
          icon: <Pencil size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return { navItems, createVoucher };
};
