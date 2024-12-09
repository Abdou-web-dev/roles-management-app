import { FunctionComponent } from "react";
import { accessLevelMappingReverse, permissionsArray } from "../constants/const";
import { Permission, PermissionType, Role, RoleFormik } from "../interfaces/RoleInterface";
import { PermissionToggle } from "./PermissionToggle";
import PermissionSelector from "./PermissionSelector";

interface PermissionsProps {
  currentRole: Role | null | undefined;
  roleFormik: RoleFormik;
  onPermissionChange: (updatedPermission: Permission) => void;
  formLoading: boolean;
}

const Permissions: FunctionComponent<PermissionsProps> = ({
  formLoading,
  currentRole,
  roleFormik,
  onPermissionChange,
}) => {
  return (
    <div className="permissions-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 gap-x-0">
      {permissionsArray?.map(({ name, label }) => {
        const isBinaryPermission = name === "EditAdmins" || name === "TransferFacilities";
        const permission = roleFormik.values.permissions.find((perm: Permission) => perm.id === name);

        const roleToEditPermission = currentRole?.permissions?.find((perm: Permission) => {
          // Check if name corresponds to a key in PermissionType and compare it with the perm.id
          const permissionTypeId = PermissionType[name as keyof typeof PermissionType]; // Get the enum value corresponding to the name
          return Number(perm?.id) === Number(permissionTypeId); // Compare the permission id correctly
        });

        const oldPermissionAccessLevel: string =
          roleToEditPermission?.accessLevel !== undefined
            ? accessLevelMappingReverse[roleToEditPermission?.accessLevel as number]
            : "None"; // Default to "None" if undefined

        if (!permission) return null;

        return (
          <div
            className="permissions-inner"
            key={name}
          >
            <label className="perm__label">{label}</label>
            {isBinaryPermission ? (
              <PermissionToggle
                formLoading={formLoading}
                key={`toggle-${name}`}
                permission={permission.id} // @ts-ignore
                accessLevel={permission.accessLevel}
                onChange={onPermissionChange} // This passes the `onPermissionChange` function defined in the parent
                initialAccessLevel={
                  roleFormik.values.permissions.find((permission: Permission) => permission.id === name)?.accessLevel
                }
              />
            ) : (
              <>
                <PermissionSelector
                  formLoading={formLoading}
                  key={`selector-${name}`}
                  onPermissionChange={onPermissionChange}
                  initialAccessLevel={
                    currentRole
                      ? (oldPermissionAccessLevel as string) || "None"
                      : roleFormik.values.permissions.find((permission: Permission) => permission.id === name)
                          ?.accessLevel || "None"
                  }
                  permissionType={name}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Permissions;
