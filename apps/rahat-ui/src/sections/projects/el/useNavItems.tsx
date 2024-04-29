import {
  PROJECT_SETTINGS_KEYS,
  useProjectAction,
  useProjectSettingsStore,
} from '@rahat-ui/query';
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
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSwal } from '../../../components/swal';
import { NavItem } from '../components';
import ConfirmModal from './confirm.modal';
import CreateVoucherModal from './create-voucher-modal';

export const useNavItems = () => {
  const { id } = useParams();
  const route = useRouter();
  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  const dialog = useSwal();
  const createTokenSummaryModal = useBoolean();
  const createTokenModal = useBoolean();
  const [projectStats, setProjectStats] = useState();

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
    contractSettings?.elproject?.address || '',
    contractSettings?.eyevoucher?.address || '',
  );

  const projectClient = useProjectAction();

  const getProjectStats = useCallback(async () => {
    const result = await projectClient.mutateAsync({
      uuid: id,
      data: {
        action: 'elProject.count_ben_vendor',
        payload: {},
      },
    });
    setProjectStats(result.data);
  }, [id]);

  useEffect(() => {
    if (projectVoucher.isSuccess) {
      setVoucherInputs((prev) => ({
        ...prev,
      }));
    }
  }, [projectVoucher.isSuccess]);

  useEffect(() => {
    getProjectStats();
  }, [getProjectStats]);

  const handleCreateVoucherTokenChange = (e: any) => {
    const { name, value } = e.target;
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue < 0) return;
    setVoucherInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createVoucher = useMintVouchers();
  const createOnlyVoucher = useOnlyMintVoucher();
  const closeProject = useCloseProject();

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
    route.push(`/projects/el/${id}/vouchers`);
  };

  const handleCloseProject = async () => {
    const { value } = await dialog.fire({
      title: 'Close Project',
      text: "Are you sure you want to close the project? You won't be able to access any project actions",
      showCancelButton: true,
      confirmButtonText: 'Close',
    });
    if (value) {
      closeProject.writeContractAsync({
        address: contractSettings?.elproject?.address,
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
          subtitle: projectStats?.benTotal,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: `/projects/el/${id}/vendors`,
          subtitle: projectStats?.vendorTotal,
          icon: <Store size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/el/${id}/transactions`,
          icon: <Receipt size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Redemptions',
          path: `/projects/el/${id}/redemptions`,
          subtitle: projectStats?.redemptionTotal,
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
          path: `/projects/el/${id}/edit`,
          icon: <Pencil size={18} strokeWidth={1.5} />,
        },
      ],
    },
  ];

  return { navItems, createVoucher };
};
