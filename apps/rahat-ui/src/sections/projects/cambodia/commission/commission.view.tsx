import { useCambodiaCommisionCurrent } from '@rahat-ui/query';
import React from 'react';
import {
  CambodiaCommisionSchemeAddView,
  CambodiaCommissionPayoutView,
} from '.';
import { useParams } from 'next/navigation';
import { CircleEllipsisIcon } from 'lucide-react';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';

export default function CommisionView() {
  const { id } = useParams();
  const { data, isFetching } = useCambodiaCommisionCurrent({
    projectUUID: id as string,
  });
  console.log(data);
  const current = false;
  return (
    <div>
      {isFetching ? (
        <div className="flex items-center justify-center mt-4">
          <div className="text-center">
            <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />

            <Label className="text-base">Loading ...</Label>
          </div>
        </div>
      ) : data?.data ? (
        <CambodiaCommissionPayoutView />
      ) : (
        <CambodiaCommisionSchemeAddView />
      )}
    </div>
  );
}
