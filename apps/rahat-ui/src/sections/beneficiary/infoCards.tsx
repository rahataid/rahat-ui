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
      <div className="p-2 grid grid-cols-3 gap-2">
        <Card className="shadow rounded col-span-2">
          <CardHeader>
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <p className="text-xl font-semibold">
                  {data?.piiData?.name ?? 'Beneficiary Name'}
                </p>
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
              <div>
                <p>{truncateEthAddress(data?.walletAddress) ?? 'N/A'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  Wallet Address
                </p>
              </div>
              <div>
                <p>{data?.bankedStatus ?? '-'}</p>
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
                  {benProject.Project.name ?? 'Projects Name'}
                </Badge>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
