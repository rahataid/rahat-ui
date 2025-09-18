import React, { useMemo } from 'react';

import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Calendar, MapPin, Shield, TrendingUp } from 'lucide-react';
import { useProjectStore } from '@rahat-ui/query';
import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';

const ProjectDetailsCard = () => {
  const projectDetails = useProjectStore((p) => p.singleProject);
  const projectDetailsListData = useMemo(
    () => [
      {
        label: 'Project Start Date',
        value: <>{dateFormat(projectDetails?.createdAt)}</>,
        icon: Calendar,
      },
      {
        label: 'Project Location',
        value: (projectDetails?.extras as { location?: string })?.location,
        icon: MapPin,
      },
      {
        label: 'Project Lead',
        value: 'Project Manager',
        icon: Shield,
      },
      {
        label: 'Project Status',
        value: projectDetails?.status?.split('_').join(' '),
        icon: TrendingUp,
        isStatus: true,
      },
    ],
    [projectDetails],
  );

  return (
    <Card className="mt-6 rounded-xl p-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {projectDetails ? (
          <>
            {projectDetailsListData.map(
              ({ label, value, icon: Icon, isStatus }) => (
                <div key={label} className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className=" text-gray-500">{label}</p>
                    {isStatus ? (
                      <Badge
                        className={`mt-1 ${
                          projectDetails?.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {value}
                      </Badge>
                    ) : (
                      <p className=" text-gray-600 text-sm font-medium capitalize">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )}
          </>
        ) : (
          <>
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <div key={idx}>
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ))}
          </>
        )}
      </div>
      <p className="mt-4 text-lg font-medium text-gray-800">
        Project Description
      </p>
      <p className="text-gray-600 leading-relaxed">
        This humanitarian aid distribution project focuses on providing direct
        cash assistance to vulnerable populations through blockchain-based
        disbursement systems. The project leverages USDC stablecoins for
        transparent, traceable, and efficient aid delivery to beneficiaries in
        need.
      </p>
    </Card>
  );
};

export default ProjectDetailsCard;
