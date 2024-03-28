'use client';

import { useBeneficiaryList, usePagination } from '@rahat-ui/query';
import BeneficiaryTable from './beneficiary.table';


export default function BeneficiaryView() {
  const { pagination } = usePagination();
  useBeneficiaryList(pagination);
  return <BeneficiaryTable />;
}
