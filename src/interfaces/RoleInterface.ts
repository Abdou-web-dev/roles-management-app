import { FormikErrors, FormikState, FormikTouched } from "formik";

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

export interface Permission {
  id: PermissionType | string;
  accessLevel: AccessLevel | string;
}

type InitialValues = {
  roleName: string;
  roleIcon: number;
  permissions: Permission[];
};

export type RoleFormik = {
  initialValues: InitialValues;
  errors: FormikErrors<InitialValues>;
  touched: FormikTouched<InitialValues>;
  values: InitialValues;
  submitCount: number;
  isSubmitting: boolean;
  isValidating: boolean;
  isValid: boolean;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  setFieldValue: (field: keyof InitialValues, value: any, shouldValidate?: boolean) => void;
  resetForm: (
    nextState?:
      | Partial<
          FormikState<{
            roleName: string;
            roleIcon: number;
            permissions: Permission[];
          }>
        >
      | undefined
  ) => void;
};

export interface Role {
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

export interface RoleInitialValues {
  roleName: string;
  roleIcon: number;
  permissions: Permission[];
}
