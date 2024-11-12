export interface Permission {
  id: number;
  accessLevel: number;
}

export interface Role {
  identifier: string;
  id: string;
  name: string;
  isCustom: boolean;
  roleIcon: number;
  permissions: Permission[];
  usersAssigned: number;
}

export interface postRoleDataPayload {
  name: string;
  roleIcon: number;
  permissions: Permission[];
}

export interface updateRoleDataPayload {
  id: string;
  name: string;
  roleIcon: number;
  permissions: Permission[];
}
