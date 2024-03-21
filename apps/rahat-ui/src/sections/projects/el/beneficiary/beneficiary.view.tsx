'use client';

import BeneficiaryTable from './beneficiary.table';

export default function BeneficiaryView({uuid}:{uuid: string}) {
  return <BeneficiaryTable uuid={uuid}/>;
}
