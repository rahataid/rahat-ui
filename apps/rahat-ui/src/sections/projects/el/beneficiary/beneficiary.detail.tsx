import { useParams } from 'next/navigation';

import { useProjectAction } from '@rahat-ui/query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Gender } from '@rahataid/sdk/enums';
import { enumToObjectArray, truncateEthAddress } from '@rumsan/sdk/utils';
import { useAssignClaims } from 'apps/rahat-ui/src/hooks/el/contracts/el-contracts';
import { getProjectAddress } from 'apps/rahat-ui/src/utils/getProjectAddress';
import { Minus, MoreVertical, Copy, CopyCheck } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TransactionTable from '../transactions/transactions.table';
import { useReadElProjectGetBeneficiaryVoucherDetail } from 'apps/rahat-ui/src/hooks/el/contracts/elProject';
import { zeroAddress } from 'viem';

type IProps = {
  beneficiaryDetails: any;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryDetail({
  beneficiaryDetails,
  closeSecondPanel,
}: IProps) {
  const assignClaims = useAssignClaims();
  const { id } = useParams();
  const getProject = useProjectAction();

  const [assignStatus, setAssignStatus] = useState(false);
  const[contractAddress,setContractAddress] = useState<any>()
  
  const walletAddress = beneficiaryDetails.name;

  const{data:beneficiaryVoucherDetails,isLoading} = useReadElProjectGetBeneficiaryVoucherDetail({
    address:contractAddress?.el,
    args:[walletAddress]
  });

  const projectSettings = localStorage.getItem('projectSettingsStore');

  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const [walletAddressCopied, setWalletAddressCopied] =
    useState<boolean>(false);

  const clickToCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setWalletAddressCopied(true);
    }
  };

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
  };



  useEffect(() => {
    if(beneficiaryVoucherDetails?.freeVoucherAddress === undefined || beneficiaryVoucherDetails?.referredVoucherAddress === undefined) return;
    if((beneficiaryVoucherDetails?.freeVoucherAddress?.toString()) !== zeroAddress || beneficiaryVoucherDetails?.referredVoucherAddress?.toString() !== zeroAddress)
     {
      setAssignStatus(true);

    }
  }, [beneficiaryVoucherDetails]);

  useEffect(()=>{
    if(projectSettings){
      const settings = JSON.parse(projectSettings)?.state?.settings?.[id]
      setContractAddress({
        el:settings?.elproject?.address,
        eyeVoucher:settings?.eyevoucher?.address,
        referredVoucher:settings?.referralvoucher?.address
      })
    }

  },[id,projectSettings])

  return (
    <>
      {isLoading ? (
        <>Loading ben data........</>
      ) : (
        <>
          <div className="flex justify-between px-4 py-2 bg-secondary">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger onClick={closeSecondPanel}>
                  <Minus size={20} strokeWidth={1.5} />
                </TooltipTrigger>
                <TooltipContent className="bg-secondary ">
                  <p className="text-xs font-medium">Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical
                  className="cursor-pointer"
                  size={20}
                  strokeWidth={1.5}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleTabChange('details')}>
                  Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="p-4 bg-card flex gap-2 justify-between items-center flex-wrap">
            <div className="flex items-center gap-2">
              <Image
                className="rounded-full"
                src="/svg/funny-cat.svg"
                alt="cat"
                height={80}
                width={80}
              />
              <div>
                <div className="flex gap-2 mb-1">
                  <h1 className="font-semibold text-xl">Name</h1>
                  <Badge>Active</Badge>
                </div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger
                      className="flex gap-3 items-center"
                      onClick={clickToCopy}
                    >
                      <p className="text-slate-500 text-base">
                        {truncateEthAddress(walletAddress)}
                      </p>
                      {walletAddressCopied ? (
                        <CopyCheck size={15} strokeWidth={1.5} />
                      ) : (
                        <Copy
                          className="text-slate-500"
                          size={15}
                          strokeWidth={1.5}
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary" side="bottom">
                      <p className="text-xs font-medium">
                        {walletAddressCopied ? 'copied' : 'click to copy'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            {!assignStatus && beneficiaryDetails?.type === 'ENROLLED' && (
              <div>
                <Button onClick={handleAssignVoucher}>Assign Voucher</Button>
              </div>
            )}
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
                      <div className="grid grid-cols-2 gap-4 p-4 bg-card">
                        <div>
                          <p className="font-light text-base">
                            {beneficiaryDetails?.type}
                          </p>
                          <p className="text-sm font-normal text-muted-foreground">
                            Beneficiary Type
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-light text-base">
                            {beneficiaryDetails?.gender}
                          </p>
                          <p className="text-sm font-normal text-muted-foreground ">
                            Gender
                          </p>
                        </div>
                        <div>
                          <p className="font-light text-base">
                            {beneficiaryDetails?.email || 'N/A'}
                          </p>
                          <p className="text-sm font-normal text-muted-foreground ">
                            Email
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-light text-base">
                            {beneficiaryDetails?.phone}
                          </p>
                          <p className="text-sm font-normal text-muted-foreground ">
                            Phone
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="transaction">
                      <div className="p-4">
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
                    {/* <DropdownMenu>
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
                </DropdownMenu> */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <p>Voucher Type</p>
                      <p className="text-sm font-light">
                        {beneficiaryVoucherDetails?.freeVoucherAddress !== undefined && beneficiaryVoucherDetails?.freeVoucherAddress !== zeroAddress
                          ? 'Free Voucher'
                          : beneficiaryVoucherDetails?.referredVoucherAddress !== undefined && beneficiaryVoucherDetails?.referredVoucherAddress !== zeroAddress
                          ? 'Discount Voucher'
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>ClaimStatus</p>
                      <p className="text-sm font-light">
                        {beneficiaryVoucherDetails?.freeVoucherAddress !== undefined  && beneficiaryVoucherDetails?.freeVoucherAddress !== zeroAddress
                          ? beneficiaryVoucherDetails?.freeVoucherClaimStatus?.toString()
                          :  beneficiaryVoucherDetails?.referredVoucherAddress !== undefined && beneficiaryVoucherDetails?.referredVoucherAddress !== zeroAddress
                          ? beneficiaryVoucherDetails?.referredVoucherClaimStatus?.toString()
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>Wallet Address</p>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger>
                            <p className="text-sm font-medium">
                              {truncateEthAddress(walletAddress)}
                            </p>
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
                            <SelectItem key={gender.value} value={gender.value}>
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
                      <Input
                        className="mt-3"
                        type="wallet"
                        placeholder="Wallet"
                      />
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
      )}
    </>
  );
}
