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
import {
  useMintVouchers,
  useCloseProject,
} from 'apps/rahat-ui/src/hooks/el/contracts/el-contracts';

export const useNavItems = () => {
  const params = useParams();
  const dialog = useSwal();
  const [voucherInputs, setVoucherInputs] = useState({
    tokens: '',
    amountInDollar: '',
    description: '',
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
  const handleCreateVoucherSubmit = async (e: any) => {
    e.preventDefault();
    await createVoucher.writeContractAsync({
      address: '0xb72Edc10170c61A0Bb85f9816Da05f368C719A9f',
      args: [
        `0xc19d064Ac3C96aa3E1b2E5b0A8e248A1A8a15775`,
        '0x494073864D8187414c54796987dBFf4AA469A8D6',
        BigInt(voucherInputs.tokens),
        voucherInputs.description,
      ],
    });
  };

  const handleCreateTokenSubmit = async (e: any) => {
    e.preventDefault();
    await createVoucher.writeContractAsync({
      address: '0xb72Edc10170c61A0Bb85f9816Da05f368C719A9f',
      args: [
        `0xC01d0B6B3CcCa78C5685B52859FB538Bd7b11483`,
        '0x494073864D8187414c54796987dBFf4AA469A8D6',
        BigInt(voucherInputs.tokens),
        voucherInputs.description,
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
