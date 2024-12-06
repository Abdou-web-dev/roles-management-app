import { FunctionComponent, useEffect, useState } from "react";
import RoleIcons from "./RoleIcons";
import PermissionSelector from "./PermissionSelector";
import { Permission, PermissionType, Role, updateRoleDataPayload } from "../interfaces/RoleInterface";
import { PermissionToggle } from "./PermissionToggle";
import { NiceSpinner } from "./NiceSpinner";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import {
  accessLevelMapping,
  accessLevelMappingReverse,
  accessLevelMappingReverseBinary,
  CUSTOM_IDENTIFIER,
  idToNameMap,
  permissionsArray,
} from "../constants/const";
import * as Yup from "yup";
import { addRole, updateRole } from "../services/api";
import { toast } from "react-toastify";
import RoleName from "./RoleName";
import Permissions from "./Permissions";
import ControlButtons from "./ControlButtons";

const RoleForm: FunctionComponent<{
  roleToEdit?: Role | null;
  setIsCreatingRole: React.Dispatch<React.SetStateAction<boolean>>;
  addOrUpdateNewRole: (newRole: Role) => void;
}> = ({ setIsCreatingRole, addOrUpdateNewRole, roleToEdit }) => {
  const [loading, setLoading] = useState(false); // state to manage loading spinner visibility
  const notifySuccess = () => toast.success(`Role ${roleToEdit ? "updated" : "created"} successfully!`);
  const notifyError = () => toast.error("Oops! Something went wrong! Please try again !");

  const initialPermissionsForSelectedRole: Permission[] = roleToEdit?.permissions?.map(({ id, accessLevel }) => ({
    // @ts-ignore
    id: idToNameMap[id] || `Unknown-${id}`, // Fallback for unmapped IDs
    accessLevel:
      // @ts-ignore
      idToNameMap[id] === "EditAdmins" || idToNameMap[id] === "TransferFacilities"
        ? // @ts-ignore
          accessLevelMappingReverseBinary[accessLevel] === "NO"
          ? 0
          : 1 || "None" // Use the actual value for these permissions
        : // @ts-ignore
          accessLevelMappingReverse[accessLevel] || "None", // Fallback for unmapped access levels
  })) as Permission[];

  const initialPermissionsForNewRole: Permission[] = permissionsArray?.map(({ name }) => ({
    id: name,
    accessLevel: name === "EditAdmins" || name === "TransferFacilities" ? 0 : "None",
    // 0 is equivalent to 'No' forEditAdmins and TransferFacilities permissions
  }));

  const initialValues = {
    roleName: roleToEdit?.name || "",
    roleIcon: roleToEdit?.roleIcon || 0,
    permissions: (roleToEdit && initialPermissionsForSelectedRole) || (initialPermissionsForNewRole as Permission[]),
  };

  const roleFormik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      roleName: Yup.string().required("Role name is required"),
    }),
    enableReinitialize: true, // Ensures form re-initializes when `roleToEdit` changes

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setLoading(true);
      const permissions = values.permissions.map((permission) => ({
        id: permission.id,
        accessLevel:
          permission.id === "TransferFacilities" || permission.id === "EditAdmins"
            ? permission.accessLevel === 0
              ? 0
              : permission.accessLevel === 1
              ? 1
              : accessLevelMapping["None"]
            : accessLevelMapping[permission.accessLevel as "None" | "View" | "Edit"], // Type assertion here, convert access level to number
      }));

      try {
        const createRolePayload = {
          name: values.roleName,
          roleIcon: values.roleIcon,
          permissions: permissions,
        };
        const updateRolePayload = {
          id: roleToEdit?.id, // Extract the id from roleToEdit
          name: values.roleName,
          roleIcon: values.roleIcon,
          permissions: permissions,
        };

        if (roleToEdit) {
          // Call update API
          const updateRoleResponse: any | Role = await updateRole(
            CUSTOM_IDENTIFIER,
            updateRolePayload as updateRoleDataPayload
          );
          const newUpdatedRole = updateRoleResponse?.data;
          // Optimistic UI: add new role immediately to parent state
          addOrUpdateNewRole(newUpdatedRole as Role);
        } else {
          try {
            // Call create API
            const addRoleResponse: any | Role = await addRole(CUSTOM_IDENTIFIER, createRolePayload);
            const newCreatedRole = addRoleResponse?.data;
            // Optimistic UI: add new role immediately to parent state
            addOrUpdateNewRole(newCreatedRole as Role);
            if (!addRoleResponse?.data) {
              console.error("Failed to update role:", addRoleResponse?.error);
            }
          } catch (error) {
            console.error("Error updating role:", error);
          }
        }

        notifySuccess();
      } catch (error) {
        console.error("Error adding role:", error);
        notifyError();
        setLoading(false); // Ensure the spinner is hidden on error
      } finally {
        setSubmitting(false);
        setTimeout(() => {
          setLoading(false);
          resetForm(); // Reset form after submission
          setIsCreatingRole(false); // Return to the role list view
        }, 900);
      }
    },
  });

  const onPermissionChange = (updatedPermission: Permission) => {
    // Update the permission in Formik's state using setFieldValue
    const permissionIndex = roleFormik.values.permissions.findIndex(
      // @ts-ignore
      (permission: Permission) => permission.id === updatedPermission.id
    );
    if (permissionIndex >= 0) {
      roleFormik.setFieldValue(`permissions[${permissionIndex}].accessLevel`, updatedPermission.accessLevel);
    }
  };

  return (
    <>
      <form
        onSubmit={roleFormik.handleSubmit}
        className={`space-y-4 role-form-container transition-opacity ${loading ? "opacity-50" : "opacity-100"} `}
        style={{ filter: loading ? "blur(4px)" : "none" }}
      >
        <RoleName {...{ roleFormik }}></RoleName>

        <div className="role-icons-container">
          <RoleIcons
            selectedIcon={roleFormik.values.roleIcon}
            setSelectedIcon={(iconIndex: number) => roleFormik.setFieldValue("roleIcon", iconIndex)}
          />
        </div>

        <h2>Permissions</h2>
        <Permissions {...{ onPermissionChange, roleFormik, roleToEdit }} />

        <ControlButtons {...{ roleFormik, setIsCreatingRole }} />
      </form>
      {/* Spinner */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-gray-700 flex items-center justify-center z-10">
          <NiceSpinner></NiceSpinner>
        </div>
      )}
    </>
  );
};

export default RoleForm;
