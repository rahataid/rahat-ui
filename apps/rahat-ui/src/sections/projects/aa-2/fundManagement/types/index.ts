export interface IFundManagement {
  id: string;
  uuid: string;
  title: string;
  group: beneficiaryGroup;
  numberOfTokens: number;
  createdBy: string;
}

interface beneficiaryGroup {
  name: string;
}
