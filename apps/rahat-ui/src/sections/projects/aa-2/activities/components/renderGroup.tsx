import {
  SelectItem,
  SelectLabel,
} from '@rahat-ui/shadcn/src/components/ui/select';
import Loader from 'apps/community-tool-ui/src/components/Loader';

export const renderGroups = (
  form: any,
  stakeholdersGroups: any,
  beneficiaryGroups: any,
  isLoading: boolean,
) => {
  if (isLoading) {
    return (
      <SelectLabel>
        <Loader />
      </SelectLabel>
    );
  }

  const selectedGroupType = form.watch('groupType');

  let groups = <SelectLabel>Please select group type</SelectLabel>;

  if (selectedGroupType === 'STAKEHOLDERS') {
    const stakeholdersGroupsList = stakeholdersGroups.filter(
      (a: any) => a?._count?.stakeholders > 0,
    );
    if (stakeholdersGroupsList.length > 0) {
      groups = stakeholdersGroupsList.map((group: any) => (
        <SelectItem key={group.id} value={group.uuid}>
          {group?.name}
        </SelectItem>
      ));
    } else {
      groups = <SelectLabel>No stakeholders groups found</SelectLabel>;
    }
  }

  if (selectedGroupType === 'BENEFICIARY') {
    const beneficiaryGroupsList = beneficiaryGroups.filter(
      (a: any) => a?._count?.groupedBeneficiaries > 0,
    );
    if (beneficiaryGroupsList.length > 0) {
      groups = beneficiaryGroupsList.map((group: any) => (
        <SelectItem key={group.id} value={group.uuid}>
          {group?.name}
        </SelectItem>
      ));
    } else {
      groups = <SelectLabel>No beneficiary groups found</SelectLabel>;
    }
  }

  return groups;
};
