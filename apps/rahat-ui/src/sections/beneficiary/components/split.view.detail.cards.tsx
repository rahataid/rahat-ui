'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { truncateEthAddress } from '@rumsan/sdk/utils/string.utils';

export default function SplitViewDetailCards({ beneficiaryDetail }: any) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 p-2">
      <Card className="shadow rounded">
        {/* <CardHeader>
                    <div className="flex justify-between">
                        <div className="flex flex-col items-start justify-start">
                            <p>{beneficiaryDetail?.piiData?.name}</p>
                            <Badge variant="outline" className="bg-secondary">
                                Not Approved
                            </Badge>
                        </div>
                    </div>
                </CardHeader> */}
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-3">
            {/* <div>
              <p>
                {truncateEthAddress(beneficiaryDetail?.walletAddress) ?? 'N/A'}
              </p>
              <p className="text-sm font-normal text-muted-foreground">
                Wallet Address
              </p>
            </div> */}
            <div>
              <p>{beneficiaryDetail?.gender ?? '-'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Gender
              </p>
            </div>
            <div>
              <p>{beneficiaryDetail?.location ?? '-'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Location
              </p>
            </div>
            <div>
              <p>{beneficiaryDetail?.piiData?.phone ?? '-'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Phone Number
              </p>
            </div>
            <div>
              <p>{beneficiaryDetail?.phoneStatus ?? '-'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Phone Status
              </p>
            </div>
            <div>
              <p>{beneficiaryDetail?.bankedStatus ?? '-'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Bank Status
              </p>
            </div>
            <div>
              <p>{beneficiaryDetail?.internetStatus ?? '-'}</p>
              <p className="text-sm font-normal text-muted-foreground">
                Internet Status
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
          {beneficiaryDetail?.BeneficiaryProject?.length ? (
            beneficiaryDetail?.BeneficiaryProject?.map((benProject: any) => {
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
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No projects involved
            </p>
          )}
        </CardContent>
      </Card>
      {extrasDisplay(beneficiaryDetail?.extras)}
    </div>
  );
}

function extrasDisplay(data: any) {
  if (!data || typeof data !== 'object') {
    return <></>;
    // return <div>No data available</div>;
  }

  return (
    <Card className="shadow rounded">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-3">
          {Object?.entries(data)?.map(([key]) => {
            return (
              <div>
                <p>{data[key] ?? '-'}</p>
                <p className="text-sm font-normal text-muted-foreground">
                  {formatKey(key)}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function formatKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
