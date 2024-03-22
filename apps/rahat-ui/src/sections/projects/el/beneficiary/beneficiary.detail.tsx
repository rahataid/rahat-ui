import { useRouter } from 'next/navigation';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Gender } from '@rahataid/sdk/enums';
import { User } from '@rumsan/sdk/types';
import { enumToObjectArray, truncateEthAddress } from '@rumsan/sdk/utils';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import TransactionTable from '../transactions/transactions.table';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useAssignClaims } from '../../../../hooks/el/contracts/el-contracts';

type IProps = {
  data: User;
};

export default function UserDetail({ beneficiaryDetails }: any) {
  const assignClaims = useAssignClaims();

  const walletAddress = beneficiaryDetails.name;

  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const [activeUser, setActiveUser] = useState<boolean>(true);
  const genderList = enumToObjectArray(Gender);
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };
  const toggleActiveUser = () => {
    setActiveUser(!activeUser);
  };

  const handleAssignVoucher = () => {
    assignClaims.writeContractAsync({
      address: '0x1B4D9FA12f3e1b1181b413979330c0afF9BbaAE5',
      args: [walletAddress],
    });
  };
  return (
    <>
      <div className="p-4 bg-card mt-2">
        <div className="flex">
          <Image
            className="rounded-full"
            src="/svg/funny-cat.svg"
            alt="cat"
            height={80}
            width={80}
          />
          <div className="flex flex-col items-center justify-center w-full mr-2 gap-2">
            <div className="flex align-center justify-between w-full ml-4">
              <h1 className="font-semibold text-xl">
                {truncateEthAddress(walletAddress)}
              </h1>
              <div className="flex">
                <div className="pl-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical
                        className="cursor-pointer"
                        size={20}
                        strokeWidth={1.5}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleTabChange('details')}
                      >
                        Details{' '}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="flex align-center justify-between w-full ml-4">
              <p className="text-slate-500">
                {truncateEthAddress(walletAddress)}
              </p>
              <Button onClick={handleAssignVoucher}>Assign Voucher</Button>
              <Badge>Active</Badge>
            </div>
          </div>
        </div>
      </div>
      {/* Details View */}

      {activeTab === 'details' && (
        <>
          <div className="w-full h-full border-l bg-card">
            <div className="border-t">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full border-b grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="transaction">Transaction</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-4 p-8 bg-card">
                    <div>
                      <p className="font-light text-base">Ben</p>
                      <p className="text-sm font-normal text-muted-foreground">
                        Beneficiary Type
                      </p>
                    </div>
                    <div>
                      <p className="font-light text-base">Male</p>
                      <p className="text-sm font-normal text-muted-foreground ">
                        Gender
                      </p>
                    </div>
                  </div>
                  <div className="border-b grid grid-cols-2 gap-4 p-8 bg-card">
                    <div>
                      <p className="font-light text-base">jd@mailinator.com</p>
                      <p className="text-sm font-normal text-muted-foreground ">
                        Email
                      </p>
                    </div>
                    <div>
                      <p className="font-light text-base">987876656778</p>
                      <p className="text-sm font-normal text-muted-foreground ">
                        Phone
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="transaction">
                  <div className="p-8">
                    <TransactionTable walletAddress={walletAddress} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
      {/* Edit View */}
      {activeTab === 'edit' && (
        <>
          <div className="flex flex-col justify-between bg-card">
            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <Input type="name" placeholder="Name" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {genderList.map((gender) => (
                        <SelectItem value={gender.value}>
                          {gender.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 mb-2">
                <p className="text-slate-700">Auth & Comms</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="grid grid-cols-subgrid col-span-2">
                  <Input type="email" placeholder="Email" />
                </div>
                <div className="grid grid-cols-subgrid col-span-1">
                  <Button
                    variant={'outline'}
                    className="border-primary text-primary"
                  >
                    Update
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="grid grid-cols-subgrid col-span-2">
                  <Input className="mt-3" type="wallet" placeholder="Wallet" />
                </div>
                <div className="grid grid-cols-subgrid col-span-1 mt-3">
                  <Button
                    variant={'outline'}
                    className="border-primary text-primary"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
