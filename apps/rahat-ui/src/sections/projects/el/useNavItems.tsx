import {
  useCloseProject,
  useMintVouchers,
} from 'apps/rahat-ui/src/hooks/el/contracts/el-contracts';
import {
  MessageSquare,
  Pencil,
  Phone,
  Receipt,
  Speech,
  Store,
  UsersRound,
  XCircle,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useSwal } from '../../../components/swal';
import { NavItem } from '../components';
import CreateTokenModal from './create-token-modal';
import CreateVoucherModal from './create-voucher-modal';

export const useNavItems = () => {
  const params = useParams();
  const dialog = useSwal();
  const [voucherInputs, setVoucherInputs] = useState({
    tokens: '',
    amountInDollar: '',
    description: '',
    currency: '',
  });
  const [completeTransaction, setCompleteTransaction] = useState(false);

  const handleCreateVoucherTokenChange = (e: any) => {
    const { name, value } = e.target;
    setVoucherInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createVoucher = useMintVouchers();
  const closeProject = useCloseProject();

  // Free Voucher
  const handleCreateVoucherSubmit = async (e: any) => {
    e.preventDefault();
    await createVoucher.writeContractAsync({
      address: '0xA69f271c08700771765D911540D912C086f42F57',
      args: [
        `0xC8A8032fc777b9Ad39C57a0eBaBbFA0b630825a0`,
        '0x1B4D9FA12f3e1b1181b413979330c0afF9BbaAE5',
        BigInt(voucherInputs.tokens),
        voucherInputs.description,
        BigInt(voucherInputs.amountInDollar),
        'USD',
      ],
    });
  };

  // Referred Voucher
  const handleCreateTokenSubmit = async (e: any) => {
    e.preventDefault();
    await createVoucher.writeContractAsync({
      address: '0xA69f271c08700771765D911540D912C086f42F57',
      args: [
        `0xd7F992c60F8FDE06Df0b93276E2e43eb6555a5FA`,
        '0x1B4D9FA12f3e1b1181b413979330c0afF9BbaAE5',
        BigInt(voucherInputs.tokens),
        voucherInputs.description,
        BigInt(voucherInputs.amountInDollar),
        'USD',
      ],
    });
    setCompleteTransaction(true);
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
          title: 'Beneficiaries',
          path: `/projects/el/${params.id}/beneficiary`,
          subtitle: 20,
          icon: <UsersRound size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Vendors',
          path: `/projects/el/${params.id}/vendors`,
          subtitle: 20,
          icon: <Store size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Transactions',
          path: `/projects/el/${params.id}/transactions`,
          subtitle: 20,
          icon: <Receipt size={18} strokeWidth={1.5} />,
        },
        {
          title: 'Campaigns',
          subtitle: 20,
          icon: <Speech size={18} strokeWidth={1.5} />,
          children: [
            {
              title: 'Voice',
              subtitle: 10,
              icon: <Phone size={18} strokeWidth={1.5} />,
              path: `/projects/el/${params.id}/campaigns/voice`,
            },
            {
              title: 'Text',
              subtitle: 10,
              icon: <MessageSquare size={18} strokeWidth={1.5} />,
              path: `/projects/el/${params.id}/campaigns/text`,
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
                handleSubmit={handleCreateVoucherSubmit}
                handleInputChange={handleCreateVoucherTokenChange}
              />
              <CreateTokenModal
                open={createVoucher.isSuccess && !completeTransaction}
                voucherInputs={voucherInputs}
                handleSubmit={handleCreateTokenSubmit}
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

  return navItems;
};
