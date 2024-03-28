'use client';
import {
  useAssignBenToProject,
  useBeneficiaryStore,
  useProjectList,
} from '@rahat-ui/query';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@rahat-ui/shadcn/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/components/select';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useBoolean } from '../../hooks/use-boolean';

export default function InfoCards() {
  const addBeneficiary = useAssignBenToProject();
  const projectsList = useProjectList({});

  const data = useBeneficiaryStore((state) => state.singleBeneficiary);
  // const { projectQuery } = useRumsanService();
  const router = useRouter();

  const [selectedProject, setSelectedProject] = React.useState<UUID>();

  const projectModal = useBoolean();
  const handleProjectChange = (d: UUID) => setSelectedProject(d);

  const handleAssignProject = async () => {
    if (!selectedProject) {
      return;
    }
    await addBeneficiary.mutateAsync({
      beneficiaryUUID: data?.uuid as UUID,
      projectUUID: selectedProject,
    });
  };

  const handleAssignModalClick = () => {
    projectModal.onTrue();
  };

  return (
    <>
      <div className="flex flex-col gap-2 py-2 pl-2">
        <Card className="shadow rounded">
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex flex-col items-start justify-start">
                <p>{data?.piiData?.name}</p>
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
                  <p>{data?.bankStatus ?? '-'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Bank Status
                  </p>
                </div>
                <div>
                  <p>{data?.internetStatus ?? '-'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Internet Status
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <p>{data?.gender ?? '-'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Gender
                  </p>
                </div>

                <div>
                  <p>{data?.location ?? '-'}</p>
                  <p className="text-sm font-normal text-muted-foreground">
                    Location
                  </p>
                </div>
                <div>
                  <p>{data?.phoneStatus ?? '-'}</p>
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
            {data?.BeneficiaryProject?.map((benProject: any) => {
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
            })}
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
                    {projectsList.data?.data.length &&
                      projectsList.data.data.map((project) => {
                        return (
                          <SelectItem key={project.uuid} value={project.uuid}>
                            {project.name}
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
