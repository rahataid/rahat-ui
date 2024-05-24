'use client';

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Archive, Minus, MoreVertical, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import AssignToProjectModal from './assignToProjectModal';
import { ListBeneficiaryGroup } from '@rahat-ui/types';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';

type IProps = {
  beneficiaryGroupDetail: ListBeneficiaryGroup;
  closeSecondPanel: VoidFunction;
};

export default function BeneficiaryGroupDetail({
  beneficiaryGroupDetail,
  closeSecondPanel,
}: IProps) {
  const router = useRouter();
  const projectModal = useBoolean();

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  return (
    <>
      <AssignToProjectModal
        beneficiaryGroupDetail={beneficiaryGroupDetail}
        projectModal={projectModal}
      />
      <div className="flex justify-between p-4 pt-5 bg-card border-b">
        <div className="flex gap-3">
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
        </div>
        <div className="flex gap-3">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Archive size={20} strokeWidth={1.5} />
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
                <p className="text-xs font-medium">Archive</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
                        delete this beneficiary group.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                      // onClick={() => removeBeneficiary(beneficiary?.uuid)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary ">
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
              <DropdownMenuItem onClick={handleAssignModalClick}>
                Assign to project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card className="shadow rounded">
        <CardHeader>
          <p className="font-mediun text-md">{beneficiaryGroupDetail.name}</p>
        </CardHeader>
        <CardHeader>
          <p className="font-mediun text-md">Projects Involved</p>
        </CardHeader>
        <CardContent>
          {beneficiaryGroupDetail?.beneficiaryGroupProject?.length ? (
            beneficiaryGroupDetail?.beneficiaryGroupProject?.map(
              (benProject: any) => {
                return (
                  <Badge
                    key={benProject.id}
                    variant="outline"
                    color="primary"
                    className="rounded cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/projects/${benProject.Project?.type}/${benProject.Project.uuid}`,
                      );
                    }}
                  >
                    {benProject.Project.name}
                  </Badge>
                );
              },
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              No projects involved
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
