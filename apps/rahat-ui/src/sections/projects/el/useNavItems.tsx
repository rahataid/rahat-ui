import {
  Lock,
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
import { useSwal } from '../../../components/swal';
import { NavItem } from '../components';
import CreateVoucherModal from './create-voucher-modal';
import CreateTokenModal from './create-token-modal';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import { useState } from 'react';
import { useMintVouchers } from 'apps/rahat-ui/src/hooks/el/contracts/el-contracts';

export const useNavItems = () => {
  const params = useParams();
  const dialog = useSwal();
  const [voucherInputs, setVoucherInputs] = useState({
    tokens: '',
    amountInDollar: '',
    // description: '',
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
  const handleCreateVoucherSubmit = async (e: any) => {
    e.preventDefault();
    await createVoucher.writeContractAsync({
      address: '0x217A4bD7C3619B2d4Fd0625B1857fdCd9279d1b3',
      args: [
        `0x1a134Beafb9D79064c8C318F233AD7f46fF49D78`,
        '0x9C8Ee9931BEc18EA883c8F23c7427016bBDeF171',
        BigInt(voucherInputs.tokens),
        // voucherInputs.description,
      ],
    });
  };

  const handleCreateTokenSubmit = async (e: any) => {
    e.preventDefault();
    await createVoucher.writeContractAsync({
      address: '0x217A4bD7C3619B2d4Fd0625B1857fdCd9279d1b3',
      args: [
        `0x3BB2526e0B8f8bD46b0187Aa4d24b351cf434437`,
        '0x9C8Ee9931BEc18EA883c8F23c7427016bBDeF171',
        BigInt(voucherInputs.tokens),
        // voucherInputs.description,
      ],
    });
    setCompleteTransaction(true);
  };

  // const beneficiary = useBeneficiaryStore(state=>state.beneficiary)

  const handleLockProject = async () => {
    const { value } = await dialog.fire({
      title: 'Lock Project',
      text: 'Are you sure you want to lock the project?',
      showCancelButton: true,
      confirmButtonText: 'Lock',
    });
    if (value) {
      dialog.fire({
        title: 'Project Locked',
        text: 'Project has been locked successfully',
        icon: 'success',
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
        {
          title: 'Lock Project',
          icon: <Lock size={18} strokeWidth={1.5} />,
          onClick: handleLockProject,
        },
        {
          title: 'Close Project',
          path: '/edit',
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
