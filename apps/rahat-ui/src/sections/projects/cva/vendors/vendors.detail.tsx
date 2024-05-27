import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Minus, MoreVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

type IProps = {
  closeSecondPanel: VoidFunction;
};
const VendorDetail = ({ closeSecondPanel }: IProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'edit'>('details');

  type ITabsNavigationProps = {
    handleTabChange: (tab: 'details' | 'edit') => void;
  };

  function TabsNavigation({ handleTabChange }: ITabsNavigationProps) {
    return (
      <div className="p-2">
        <TabsList className="w-full grid grid-cols-2 border h-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="transaction">Transaction</TabsTrigger>
        </TabsList>
      </div>
    );
  }
  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex justify-between p-4 pt-5 bg-card border-b">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger onClick={closeSecondPanel}>
              <Minus size={20} strokeWidth={1.5} />
            </TooltipTrigger>
            <TooltipContent className="bg-secondary">
              <p className="text-xs font-medium">Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-3">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <AlertDialog>
                  <AlertDialogTrigger className="flex items-center">
                    <Trash2
                      className="cursor-pointer"
                      color="red"
                      size={20}
                      strokeWidth={1.5}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this beneficiary.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                <p className="text-xs font-medium">Delete</p>
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
              <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange('details')}>
                Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <Card className="shadow rounded">
          <CardContent className="pt-6">
            <h1>Vendor Name</h1>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div>
                <p className="font-light text-base">{'gender'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Gender
                </p>
              </div>
              <div>
                <p className="font-light text-base">{'N/A'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Email
                </p>
              </div>
              <div className="text-right">
                <p className="font-light text-base">{'N/A'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Phone
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default VendorDetail;
