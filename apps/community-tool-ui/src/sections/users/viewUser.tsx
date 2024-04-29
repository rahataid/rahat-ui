import { Button } from '@rahat-ui/shadcn/components/button';
import { Label } from '@rahat-ui/shadcn/components/label';
import { Switch } from '@rahat-ui/shadcn/components/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
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
import { truncateEthAddress } from '@rumsan/core/utilities/string.utils';
import { User } from '@rumsan/sdk/types';
import {
  MoreVertical,
  PlusCircle,
  Trash2,
  Minus,
  Telescope,
  FilePenLine,
  MinusIcon,
  PlusIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { UsersRoleTable } from './usersRoleTable';
import { enumToObjectArray } from '@rumsan/sdk/utils';
import { Gender } from '@rahataid/sdk/enums';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import EditUser from './editUser';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRoleList } from '@rahat-ui/community-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  useUserAddRoles,
  useUserCurrentUser,
  useUserEdit,
} from '@rumsan/react-query';
import { UUID } from 'crypto';
import { ROLE_TYPE } from '../../constants/user.const';

type IProps = {
  userDetail: User;
  closeSecondPanel: VoidFunction;
};

const FormSchema = z.object({
  role: z.string(),
});
export default function UserDetail({ userDetail, closeSecondPanel }: IProps) {
  const updateUserRole = useUserAddRoles();
  const { data } = useUserCurrentUser();

  const isAdmin = data?.data?.roles.includes(ROLE_TYPE.ADMIN);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: '',
    },
  });

  const [open, setOpen] = useState(false);

  const { reset } = form;
  const { isSubmitting, isSubmitSuccessful } = form.formState;

  const { data: roleData } = useRoleList();
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | null>(
    'details',
  );
  const [activeUser, setActiveUser] = useState<boolean>(true);
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };
  const toggleActiveUser = () => {
    setActiveUser(!activeUser);
  };

  const changedDate = new Date(userDetail.createdAt as Date);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleAssignRole = (data: any) => {
    updateUserRole.mutateAsync({
      uuid: userDetail.uuid as UUID,
      roles: [data.role],
    });
    setOpen(false);
  };
  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);
  return (
    <>
      <div className="flex justify-between items-center p-4 pt-5">
        {/* Minimize  */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={closeSecondPanel}>
              <MinusIcon size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary ">
              <p className="text-xs font-medium">Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-3">
          {/* Add Roles */}
          {isAdmin && (
            <>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PlusIcon
                          className="cursor-pointer"
                          size={18}
                          strokeWidth={1.6}
                          color="#007bb6"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <h1>Assign Role</h1>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DialogTrigger>

                <Form {...form}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Role</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleAssignRole)}>
                      <DialogDescription>
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value[0]}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectGroup>
                                      {roleData?.data &&
                                        roleData?.data?.map((role: any) => (
                                          <SelectItem
                                            value={role.name}
                                            key={role.id}
                                          >
                                            {role.name}
                                          </SelectItem>
                                        ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </DialogDescription>
                      <DialogFooter>
                        <div className="flex items-center justify-center mt-2 gap-4">
                          <Button variant="outline" type="submit">
                            Assign
                          </Button>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                        </div>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Form>
              </Dialog>

              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger onClick={() => handleTabChange('edit')}>
                    <FilePenLine size={20} strokeWidth={1.5} color="#007bb6" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-secondary ">
                    <p className="text-xs font-medium">Edit</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
          {/* Actions */}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={() => handleTabChange('details')}>
                <Telescope size={20} strokeWidth={1.5} color="#007bb6" />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex justify-between p-2">
        <div className="flex items-center space-x-2">
          <Image
            className="rounded-full"
            src="/svg/PortraitPlaceholder.png"
            alt="cat"
            height={80}
            width={80}
          />
          <div>
            <h1 className="font-semibold text-xl">{userDetail.name}</h1>
            <p className="text-slate-500">
              {userDetail.email
                ? userDetail.email
                : truncateEthAddress(userDetail.wallet || '-')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Label
            className="text-slate-500 font-light text-sm"
            htmlFor="activeUser"
          >
            {activeUser ? 'Active' : 'Inactive'}
          </Label>
          <Switch
            className="data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-green-600"
            id="activeUser"
            checked={activeUser}
            onCheckedChange={toggleActiveUser}
          />
        </div>
      </div>
      {/* Details View */}
      {activeTab === 'details' && (
        <Tabs defaultValue="details">
          <div className="p-2">
            <TabsList className="w-full grid grid-cols-2 border h-auto">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="details">
            <Card className="shadow rounded m-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-light text-base">{userDetail.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      Name
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-light text-base">
                      {userDetail.gender || '-'}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground ">
                      Gender
                    </p>
                  </div>
                  <div>
                    <p className="font-light text-base">
                      {userDetail.email || '-'}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground ">
                      Email
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-light text-base">
                      {userDetail.phone || '-'}
                    </p>
                    <p className="text-sm font-normal text-muted-foreground ">
                      Phone
                    </p>
                  </div>

                  <div>
                    <p className="font-light text-base">{formattedDate}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      Created At
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="roles">
            <div className="px-2">
              <UsersRoleTable
                userRole={userDetail?.uuid as UUID}
                isAdmin={isAdmin}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
      {/* Edit View */}
      {activeTab === 'edit' && (
        <>
          <div className="flex flex-col justify-between ">
            <div className="p-4 border-t">
              <EditUser userDetail={userDetail} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
