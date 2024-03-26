import {
  useCloseProject,
  useMintVouchers,
  useOnlyMintVoucher,
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
import { useEffect, useState } from 'react';
import { useSwal } from '../../../components/swal';
import { NavItem } from '../components';
import CreateTokenModal from './create-token-modal';
import CreateVoucherModal from './create-voucher-modal';
import { useProjectAction } from 'libs/query/src/lib/projects/projects';
import { getProjectAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { useProjectVoucher } from 'apps/rahat-ui/src/hooks/el/subgraph/querycall';

export const useNavItems = () => {
  const params = useParams();
  const dialog = useSwal();

  type AddressType = {
    donorAddress: `0x${string}`;
    eyeVoucherAddress: `0x${string}`;
    referralVoucherAddress: `0x${string}`;
    elProjectAddress: `0x${string}`;
  };

  const { data } = useProjectVoucher(
    '0xaC29e7A5b6A4657a4B98E43F3b9517152867c896',
    '0x93B2C030C17B86500962889cE3C380b4376F42D4',
  );

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

  const uuid = params.id;
  const getProject = useProjectAction();

  const fetchAddress = async () => {
    try {
      let addressValue: any;
      const address = await getProjectAddress(getProject, uuid);
      setAddresses({
        donorAddress: address?.value?.rahatdonor?.address,
        elProjectAddress: address?.value?.elproject?.address,
        eyeVoucherAddress: address?.value?.eyevoucher?.address,
        referralVoucherAddress: address?.value?.referralvoucher?.address,
      });
    } catch (error) {
      console.log('Error fetching project address:', error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

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

  console.log(voucherInputs);

  // Free Voucher
  const handleCreateVoucherSubmit = async (e: any) => {
    e.preventDefault();
    if (!addresses) return;
    const referralLimit = 3;
    !data
      ? await createVoucher.writeContractAsync({
          address: addresses?.donorAddress,
          args: [
            addresses?.eyeVoucherAddress,
            addresses.referralVoucherAddress,
            addresses.elProjectAddress,
            BigInt(voucherInputs.tokens),
            voucherInputs.description,
            voucherInputs.descriptionReferred,
            BigInt(voucherInputs.amountInDollar),
            BigInt(voucherInputs.amountInDollarReferral),
            BigInt(referralLimit),
            voucherInputs.currency,
          ],
        })
      : await createOnlyVoucher.writeContractAsync({
          address: addresses?.donorAddress,
          args: [
            '0x93B2C030C17B86500962889cE3C380b4376F42D4',
            '0x0e952DFcf7506Dfd1c38822173531c658a27996e',
            '0xaC29e7A5b6A4657a4B98E43F3b9517152867c896',
            BigInt(voucherInputs.tokens),
            BigInt(referralLimit),
          ],
        });
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
          title: 'Redemptions',
          path: `/projects/el/${params.id}/redemptions`,
          // subtitle: ,
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
                data={data}
                setVoucherInputs={setVoucherInputs}
              />
              {/* <CreateTokenModal
                open={createVoucher.isSuccess && !completeTransaction}
                voucherInputs={voucherInputs}
                handleSubmit={handleCreateTokenSubmit}
              /> */}
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
