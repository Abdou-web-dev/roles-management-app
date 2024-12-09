import {
  accessLevelMapping,
  accessLevelMappingReverse,
  accessLevelMappingReverseBinary,
  idToNameMap,
  permissionsArray,
} from "../../constants/const";
import { Permission, Role } from "../../interfaces/RoleInterface";

export const getInitialPermissionsForRole = (role: Role | null | undefined) => {
  const rolePermissions = role?.permissions?.map(({ id, accessLevel }) => ({
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

export function validateRoleName(
  roleName: string,
  existingRoles: Role[],
  currentRole: Role | null | undefined,
  notify: (message: string, type: "success" | "error" | "info") => void
): string | undefined {
  // Check for empty roleName
  if (!roleName.trim()) {
    notify("You must enter a name for this role!", "error");
    return "Role name is required";
  }

  // Check for minimum length
  if (roleName.trim().length < 3) {
    notify("Role name must be at least 3 characters long", "error");
    return "Role name must be at least 3 characters long";
  }

  // Check for uniqueness
  const isDuplicate = existingRoles?.some((role: Role) => {
    return role.name.toLowerCase() === roleName.trim().toLowerCase() && role.id !== currentRole?.id;
  });

  if (isDuplicate) {
    notify("A role with this name already exists!", "error");
    return "Role name must be unique";
  }

  return undefined; // No errors
}
