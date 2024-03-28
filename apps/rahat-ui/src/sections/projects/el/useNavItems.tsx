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
  MessageSquare,
  Pencil,
  Phone,
  Receipt,
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

type AddressType = {
  donorAddress: `0x${string}`;
  eyeVoucherAddress: `0x${string}`;
  referralVoucherAddress: `0x${string}`;
  elProjectAddress: `0x${string}`;
};

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

  const [addresses, setAddresses] = useState<AddressType>();

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
      console.log('projectVoucher', projectVoucher.data);
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

    const {
      donorAddress,
      eyeVoucherAddress,
      referralVoucherAddress,
      elProjectAddress,
    } = contractSettings;
    const {
      tokens,
      description,
      descriptionReferred,
      amountInDollar,
      amountInDollarReferral,
      currency,
    } = voucherInputs;
    const referralLimit = BigInt(3);
    const tokensBigInt = BigInt(tokens);

    const commonArgs = [
      eyeVoucherAddress,
      referralVoucherAddress,
      elProjectAddress,
      tokensBigInt,
      referralLimit,
    ];

    if (description.length === 0) {
      await createVoucher.writeContractAsync({
        address: donorAddress,
        args: [
          ...commonArgs,
          description,
          descriptionReferred,
          BigInt(amountInDollar),
          BigInt(amountInDollarReferral),
          currency,
        ],
      });
    } else {
      await createOnlyVoucher.writeContractAsync({
        address: donorAddress,
        args: commonArgs,
      });
    }
  };

  // Referred Voucher
  // const handleCreateTokenSubmit = async (value: any) => {
  //   await createVoucher.writeContractAsync({
  //     address: '0xA69f271c08700771765D911540D912C086f42F57',
  //     args: [
  //       `0xd7F992c60F8FDE06Df0b93276E2e43eb6555a5FA`,
  //       '0x1B4D9FA12f3e1b1181b413979330c0afF9BbaAE5',
  //       BigInt(+voucherInputs.tokens * 3),
  //       value.description,
  //       BigInt(value.price),
  //       voucherInputs.currency,
  //     ],
  //   });
  //   setCompleteTransaction(true);
  // };

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
          title: 'Campaigns',
          icon: <Speech size={18} strokeWidth={1.5} />,
          children: [
            {
              title: 'Voice',
              subtitle: 10,
              icon: <Phone size={18} strokeWidth={1.5} />,
              path: `/projects/el/${id}/campaigns/voice`,
            },
            {
              title: 'Text',
              subtitle: 10,
              icon: <MessageSquare size={18} strokeWidth={1.5} />,
              path: `/projects/el/${id}/campaigns/text`,
            },
          ],
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
