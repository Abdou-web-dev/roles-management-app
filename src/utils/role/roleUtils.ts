import {
  accessLevelMapping,
  accessLevelMappingReverse,
  accessLevelMappingReverseBinary,
  idToNameMap,
  permissionsArray,
} from "../../constants/const";
import { Permission, Role } from "../../interfaces/RoleInterface";

export const getInitialPermissionsForRole = (roleToEdit?: Role | null | undefined) => {
  const rolePermissions = roleToEdit?.permissions?.map(({ id, accessLevel }) => ({
    // @ts-ignore
    id: idToNameMap[id] || `Unknown-${id}`,
    accessLevel:
      // @ts-ignore
      idToNameMap[id] === "EditAdmins" || idToNameMap[id] === "TransferFacilities" // @ts-ignore
        ? accessLevelMappingReverseBinary[accessLevel] === "NO"
          ? 0
          : 1 // @ts-ignore
        : accessLevelMappingReverse[accessLevel] || "None",
  })) as Permission[];

  const defaultPermissions = permissionsArray?.map(({ name }) => ({
    id: name,
    accessLevel: name === "EditAdmins" || name === "TransferFacilities" ? 0 : "None",
  })) as Permission[];

  return rolePermissions || defaultPermissions;
};

/**
 * Transforms user-selected permissions into backend-compatible format.
 * @param permissions - List of permissions from the form values.
 * @returns Transformed permissions.
 */
export const transformPermissions = (permissions: Permission[]) => {
  return permissions?.map((permission) => ({
    id: permission.id,
    accessLevel:
      permission.id === "TransferFacilities" || permission.id === "EditAdmins"
        ? permission.accessLevel === 0
          ? 0
          : permission.accessLevel === 1
          ? 1
          : accessLevelMapping["None"]
        : accessLevelMapping[permission.accessLevel as "None" | "View" | "Edit"], // Convert access level to backend-compatible format
  }));
};
