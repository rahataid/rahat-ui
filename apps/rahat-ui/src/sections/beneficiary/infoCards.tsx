'use client';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils';
import * as React from 'react';
import { useProjectAction } from '../../../../../libs/query/src/lib/projects/projects';
import { useSwal } from '../../components/swal';
import { useBoolean } from '../../hooks/use-boolean';
import { useRouter } from 'next/navigation';
import AssignToProjectModal from './components/assignToProjectModal';

export default function InfoCards({ data, voucherData }: any) {
  const addBeneficiary = useProjectAction();
  const router = useRouter();
  const alert = useSwal();
  const projectModal = useBoolean();

  const handleAssignModalClick = () => {
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
      <AssignToProjectModal
        beneficiaryDetail={data}
        projectModal={projectModal}
      />
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
    </>
  );
}
