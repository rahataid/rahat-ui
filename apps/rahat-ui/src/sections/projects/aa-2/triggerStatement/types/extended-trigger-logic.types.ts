export type ExtendedTriggerLogicGroup = {
  operator: 'AND' | 'OR';
  triggers: string[];
};

export type ExtendedTriggerLogic = {
  groups: ExtendedTriggerLogicGroup[];
  joinOperator: 'AND' | 'OR';
};
