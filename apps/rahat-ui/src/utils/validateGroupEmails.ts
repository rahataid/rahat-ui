import {
  StakeholdersGroup,
  BeneficiariesGroup,
  Stakeholder,
  GroupedBeneficiary,
} from '@rahat-ui/types';

type ValidateGroupsParams<T, M> = {
  groups: T[];
  fieldName: string;
  getMembers: (group: T) => M[];
  getFieldValue: (member: M, fieldName: string) => string | undefined;
};

export const validateGroupsField = <T extends { name?: string }, M>({
  groups,
  fieldName,
  getMembers,
  getFieldValue,
}: ValidateGroupsParams<T, M>) => {
  if (!Array.isArray(groups) || groups.length === 0) {
    return {
      valid: true,
      invalidGroups: [],
    };
  }

  const invalidGroups = groups
    .filter((group) => {
      const members = getMembers(group);

      if (!Array.isArray(members)) return false;

      return members.some((member) => {
        const value = getFieldValue(member, fieldName);
        return !value?.trim();
      });
    })
    .map((group) => group?.name || 'Unnamed Group');

  if (invalidGroups.length > 0) {
    return {
      valid: false,
      invalidGroups,
    };
  }

  return {
    valid: true,
    invalidGroups: [],
  };
};

export const validateStakeholderGroupFields = (
  groups: StakeholdersGroup[],
  fieldName: string,
) => {
  return validateGroupsField<StakeholdersGroup, Stakeholder>({
    groups,
    fieldName,
    getMembers: (group: StakeholdersGroup) => group?.stakeholders,
    getFieldValue: (member: Stakeholder, field: string) => {
      const value = member?.[field as keyof Stakeholder];
      return typeof value === 'string' ? value : undefined;
    },
  });
};

export const validateBeneficiaryGroupFields = (
  groups: BeneficiariesGroup[],
  fieldName: string,
) => {
  return validateGroupsField<BeneficiariesGroup, GroupedBeneficiary>({
    groups,
    fieldName,
    getMembers: (group: BeneficiariesGroup) => group?.groupedBeneficiaries,
    getFieldValue: (member: GroupedBeneficiary, field: string) => {
      const pii = member?.Beneficiary?.pii;
      if (!pii) return undefined;
      const value = (pii as unknown as Record<string, unknown>)?.[field];
      return typeof value === 'string' ? value : undefined;
    },
  });
};
