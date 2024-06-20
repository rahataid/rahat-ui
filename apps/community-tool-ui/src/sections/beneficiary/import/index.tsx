'use client';
import { useActiveFieldDefinitionsList } from '@rahat-ui/community-query';
import ImportBen from './Beneficiary';

export default function ImportBeneficiary() {
  let extraFields = [];
  const { data } = useActiveFieldDefinitionsList();
  if (data && data.data.length > 0) {
    const myFields = data.data.map((obj: any) => obj.name);
    extraFields = myFields;
  }

  return <ImportBen extraFields={extraFields} />;
}
