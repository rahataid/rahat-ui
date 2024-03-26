'use client';
import * as React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/components/dialog';
import { useProjectAction } from '../../../../../libs/query/src/lib/projects/projects';
import { useRumsanService } from '../../providers/service.provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/components/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/components/tooltip';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { MoreVertical } from 'lucide-react';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { MS_ACTIONS } from '@rahataid/sdk';
import { useBoolean } from '../../hooks/use-boolean';
import { useSwal } from '../../components/swal';

export default function InfoCards({ data, voucherData }) {
  const addBeneficiary = useProjectAction();
  const { projectQuery } = useRumsanService();

  const [selectedProject, setSelectedProject] = React.useState('');
  const [selectedRow, setSelectedRow] = React.useState(null) as any;

  const alert = useSwal();

  const projectsList = projectQuery.useProjectList({});
  const d = projectsList.data;
  const projectList = d?.data || [];

  const projectModal = useBoolean();
  const handleProjectChange = (d: string) => setSelectedProject(d);

  const handleAssignProject = async () => {
    if (!selectedProject) return alert('Please select a project');

    const result = await addBeneficiary.mutateAsync({
      uuid: selectedProject,
      data: {
        action: MS_ACTIONS.BENEFICIARY.ASSGIN_TO_PROJECT,
        payload: {
          beneficiaryId: data?.uuid,
        },
      },
    });
  };

  const handleAssignModalClick = (row: any) => {
    setSelectedRow(row);
    projectModal.onTrue();
  };

  React.useEffect(() => {
    if (!addBeneficiary) return;
    if (addBeneficiary.isSuccess) {
      alert.fire({
        title: 'Beneficiary Assigned Successfully',
        icon: 'success',
      });
      addBeneficiary.reset();
    }
    if (addBeneficiary.isError) {
      alert.fire({
        title: 'Error while updating Beneficiary',
        icon: 'error',
      });
      addBeneficiary.reset();
    }
  }, [addBeneficiary, alert]);

  return (
    <>
      <div className="flex flex-col gap-2 py-2 pl-2">
        <Card className="shadow rounded">
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>Beneficiary Name</p>
                <Badge variant="outline" className="bg-secondary">
                  Not Approved
                </Badge>
              </div>
              <Button onClick={handleAssignModalClick}>
                Assign To Project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between gap-8">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-xs">
                    {truncateEthAddress(data?.walletAddress) ?? 'N/A'}
                  </p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Wallet Address
                  </p>
                </div>
                <div>
                  <p>{data?.bankStatus ?? 'test'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Bank Status
                  </p>
                </div>
                <div>
                  <p>{data?.internetStatus ?? 'test'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Internet Status
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p>{data?.gender ?? 'test'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Gender
                  </p>
                </div>

                <div>
                  <p>{data?.location ?? 'test'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Location
                  </p>
                </div>
                <div>
                  <p>{data?.phoneStatus ?? 'test'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Phone Status
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow rounded">
          <CardHeader>
            <p className="font-mediun text-md">Projects Involved</p>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" color="secondary" className="rounded">
              Test Project
            </Badge>
          </CardContent>
        </Card>
      </div>
      <div className="py-2 w-full border-t">
        <div className="p-4 flex flex-col gap-0.5 text-sm">
          <Dialog
            open={projectModal.value}
            onOpenChange={projectModal.onToggle}
          >
            {/* <DialogTrigger className=" hover:bg-muted p-1 rounded text-left">
              Assign Projects
            </DialogTrigger> */}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Project</DialogTitle>
                <DialogDescription>
                  Select the project to be assigned to the beneficiary
                </DialogDescription>
              </DialogHeader>
              <div>
                <Select onValueChange={handleProjectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectList.length > 0 &&
                      projectList.map((project: any) => {
                        return (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        );
                      })}
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
                  onClick={handleAssignProject}
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
      </div>
    </>
  );
}
