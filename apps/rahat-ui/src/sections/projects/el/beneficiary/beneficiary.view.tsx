'use client';

import { useBeneficiaryList } from '@rahat-ui/query';
import BeneficiaryTable from './beneficiary.table';

export default function BeneficiaryView() {
  const ben = useBeneficiaryList({});
  return <BeneficiaryTable />;
}
