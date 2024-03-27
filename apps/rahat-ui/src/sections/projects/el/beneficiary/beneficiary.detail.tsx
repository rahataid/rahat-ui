import { useParams, useRouter } from 'next/navigation';

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
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useProjectAction } from '@rahat-ui/query';
import { getProjectAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';

export default function UserDetail({ beneficiaryDetails }: any) {
  const assignClaims = useAssignClaims();
  const { id } = useParams();
  const getProject = useProjectAction();

  const walletAddress = beneficiaryDetails.name;

  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const genderList = enumToObjectArray(Gender);
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  const handleAssignVoucher = () => {
    getProjectAddress(getProject, id as string).then((res) => {
      assignClaims.writeContractAsync({
        address: res.value.elproject.address,
        args: [walletAddress],
      });
    });

    // assignClaims.writeContractAsync({
    //   address: '0x1B4D9FA12f3e1b1181b413979330c0afF9BbaAE5',
    //   args: [walletAddress],
    // });
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
          <Card className="shadow rounded">
            <CardHeader>
              <div className="flex justify-between items-center">
                <p>Voucher Details</p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical size={20} strokeWidth={1.5} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <div className="p-1 flex flex-col gap-0.5 text-sm">
                      <Dialog>
                        <DialogTrigger className="hover:bg-muted p-1 rounded text-left">
                          Assign Project
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Project</DialogTitle>
                            <DialogDescription>
                              Select the project to be assigned to the
                              beneficiary
                            </DialogDescription>
                          </DialogHeader>
                          <div>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Projects" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Project 1</SelectItem>
                                <SelectItem value="2">Project 2</SelectItem>
                                <SelectItem value="3">Project 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter className="sm:justify-end">
                            <DialogClose asChild>
                              <Button type="button" variant="ghost">
                                Close
                              </Button>
                            </DialogClose>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-primary"
                            >
                              Assign
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger className="hover:bg-muted p-1 rounded text-left">
                          Assign Token
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Token</DialogTitle>
                            <DialogDescription>
                              Enter Token to the beneficiary
                            </DialogDescription>
                          </DialogHeader>
                          <Input type="text" placeholder="Token" />
                          <DialogFooter className="sm:justify-end">
                            <DialogClose asChild>
                              <Button type="button" variant="ghost">
                                Close
                              </Button>
                            </DialogClose>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-primary"
                            >
                              Assign
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p>Voucher Type</p>
                  <p className="text-sm font-light">Discount</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Free Voucher</p>
                  <p className="text-sm font-light">Discount Voucher</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>Wallet Address</p>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-sm font-medium">N/A</p>
                      </TooltipTrigger>
                      <TooltipContent className="bg-secondary ">
                        <p className="text-xs font-medium">click to copy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
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
