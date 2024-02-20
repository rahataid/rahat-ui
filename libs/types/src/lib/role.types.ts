export interface CreateRolePayload {
  name: string;
  isSystem: boolean;
}

export interface EditRolePayload {
  name?: string;
}

export interface DeleteRolePayload {
  name?: string;
}
