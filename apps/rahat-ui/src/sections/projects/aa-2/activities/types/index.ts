import { Template } from 'apps/rahat-ui/src/types/activities';

export interface TemplateDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSelectTemplate?: (template: Template) => void;
  setOpen: (open: boolean) => void;
}
export interface BeneficiaryGroup {
  id: number;
  uuid: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    stakeholders: number;
  };
}
export interface StakeholderGroup {
  id: number;
  uuid: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    stakeholders: number;
  };
}
