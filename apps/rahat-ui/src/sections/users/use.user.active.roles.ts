import { UUID } from 'crypto';
import { useListActiveRoles } from '@rahat-ui/query';

export type ActiveUserRole = {
  id: number;
  userId: number;
  roleId: number;
  expiry: string | null;
  xrefId: string | null;
  createdAt: string;
  createdBy: number | null;
  Role: {
    id: number;
    name: string;
    isSystem: boolean;
    expiry: string | null;
    createdAt: string;
    updatedAt: string;
    createdBy: number | null;
    updatedBy: number | null;
    Permission: {
      id: number;
      roleId: number;
      action: string;
      subject: string;
      inverted: boolean;
      conditions: Record<string, any> | null;
      reason: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
  };
};

export const useUserActiveRoles = (uuid: UUID) => {
  return useListActiveRoles(uuid);
};
