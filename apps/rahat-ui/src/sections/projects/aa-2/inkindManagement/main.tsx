'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { InkindTabs } from './components';
import { useInkinds } from '@rahat-ui/query';
import { UUID } from 'crypto';

export default function InKindManagementView() {
  const router = useRouter();
  const { id } = useParams();

  // Query goes here
  const { data } = useInkinds(id as UUID, {
    page: 0 + 1,
    perPage: 10,
    order: 'desc',
    sort: 'createdAt',
  });

  const isInkindDataAvailable = !!data?.data.length;
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center space-x-4">
        <Heading
          title="Inkind Management"
          description="Track all inkind items and stock movements here"
        />
        <RoleAuth
          roles={[AARoles.ADMIN, AARoles.Municipality]}
          hasContent={false}
        >
          <IconLabelBtn
            Icon={Plus}
            handleClick={() =>
              router.push(`/projects/aa/${id}/inkind-management/assign`)
            }
            name="Assign Inkind"
            disabled={!isInkindDataAvailable}
          />
        </RoleAuth>
      </div>
      <InkindTabs />
    </div>
  );
}
