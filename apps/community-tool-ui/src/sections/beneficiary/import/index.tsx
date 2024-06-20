'use client';
import { useActiveFieldDefinitionsList } from '@rahat-ui/community-query';
import ImportBen from './Beneficiary';

export default function ImportBeneficiary() {
  let extraFields = [];
  const { data } = useActiveFieldDefinitionsList();
  if (data && data.data.length > 0) {
    const myFields = data.data.map((obj: any) => {
      return {
        name: obj.name,
        variations: obj.variations || [],
      };
    });
    extraFields = myFields;
  }

  return <ImportBen fieldDefinitions={extraFields} />;
}
