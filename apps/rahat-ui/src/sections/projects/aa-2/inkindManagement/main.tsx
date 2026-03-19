'use client';

import { AARoles, RoleAuth } from '@rahat-ui/auth';
import { Heading, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { InkindTabs } from './components';

export default function InKindManagementView() {
  const router = useRouter();
  const { id } = useParams();

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
          />
        </RoleAuth>
      </div>
      <InkindTabs />
    </div>
  );
}
