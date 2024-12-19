import { useCambodiaCommisionCurrent } from '@rahat-ui/query';
import React from 'react';
import {
  CambodiaCommisionSchemeAddView,
  CambodiaCommissionPayoutView,
} from '.';
import { useParams } from 'next/navigation';

export default function CommisionView() {
  const { id } = useParams();
  const { data } = useCambodiaCommisionCurrent({ projectUUID: id as string });
  console.log(data);
  const current = false;
  return (
    <div>
      {data?.data ? (
        <CambodiaCommissionPayoutView />
      ) : (
        <CambodiaCommisionSchemeAddView />
      )}
    </div>
  );
}
