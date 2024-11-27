// Enums
export enum PermissionType {
  Locks = "1",
  ActivateLocks = "2",
  Inventory = "3",
  TenantLocks = "4",
  Facilities = "5",
  TransferFacilities = "6",
  Users = "7",
  EditAdmins = "8",
  Subdomains = "9",
  ApiSettings = "10",
}
export enum AccessLevel {
  None = 0,
  Read = 1,
  Write = 2,
}

// export type PermissionTypeMap = {
//   [key: string]: PermissionType;
// };

export interface Permission {
  id: PermissionType | string;
  accessLevel: AccessLevel | string;
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

export interface FormValues {
  roleName: string;
  roleIcon: number;
  permissions: Permission[]; // Change to array of Permission objects
}
