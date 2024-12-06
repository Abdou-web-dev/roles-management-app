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
  CUSTOM_IDENTIFIER,
  idToNameMap,
  permissionsArray,
} from "../constants/const";
import * as Yup from "yup";
import { addRole, updateRole } from "../services/api";
import { toast } from "react-toastify";

const RoleForm: FunctionComponent<{
  roleToEdit?: Role | null;
  setIsCreatingRole: React.Dispatch<React.SetStateAction<boolean>>;
  addOrUpdateNewRole: any;
}> = ({ setIsCreatingRole, addOrUpdateNewRole, roleToEdit }) => {
  const [loading, setLoading] = useState(false); // state to manage loading spinner visibility
  const notifySuccess = () => toast.success(`Role ${roleToEdit ? "updated" : "created"} successfully!`);
  const notifyError = () => toast.error("Oops! Something went wrong! Please try again !");

  const initialValues = {
    roleName: roleToEdit?.name || "",
    roleIcon: roleToEdit?.roleIcon || 0,
    permissions:
      (roleToEdit &&
        roleToEdit?.permissions?.map(({ id, accessLevel }) => ({
          // @ts-ignore
          id: idToNameMap[id] || `Unknown-${id}`, // Fallback for unmapped IDs
          accessLevel:
            // @ts-ignore
            accessLevelMappingReverse[accessLevel] || "None", // Fallback for unmapped access levels
        }))) ||
      permissionsArray?.map(({ name }) => ({
        id: name,
        accessLevel: roleToEdit
          ? roleToEdit?.permissions?.find((perm: any) => perm.id === name)?.accessLevel || "None" // Use 'None' if not found
          : name === "EditAdmins" || name === "TransferFacilities"
          ? 0
          : "None", // Set to 'No' for binary permissions initially
      })),
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

  const inputError = roleFormik.touched.roleName && roleFormik.errors.roleName;

  return (
    <>
      <form
        onSubmit={roleFormik.handleSubmit}
        className={`space-y-4 role-form-container transition-opacity ${loading ? "opacity-50" : "opacity-100"} `}
        style={{ filter: loading ? "blur(4px)" : "none" }}
      >
        <div className="custom-role-name">
          <label htmlFor="roleName">Custom Role Name</label>
          <input
            type="text"
            id="roleName"
            name="roleName"
            placeholder="Input Custom Role Name"
            className={` mt-1 block w-full rounded-md ${inputError ? "input__error" : ""}`}
            value={roleFormik.values.roleName}
            // value={roleToEdit ? roleToEdit?.name : roleFormik.values.roleName}
            onChange={roleFormik.handleChange}
            onBlur={roleFormik.handleBlur}
          />
          {roleFormik.touched.roleName && roleFormik.errors.roleName && (
            <div className="role__name_error">{roleFormik.errors.roleName}</div>
          )}
        </div>

        <div className="role-icons-container">
          <label
            htmlFor="roleIcon"
            className=""
          >
            Select Role Icon
          </label>
          <RoleIcons
            selectedIcon={roleFormik.values.roleIcon}
            setSelectedIcon={(iconIndex: number) => roleFormik.setFieldValue("roleIcon", iconIndex)}
          />
        </div>

        <h2>Permissions</h2>
        <div className="permissions-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 gap-x-0">
          {permissionsArray?.map(({ name, label }) => {
            const isBinaryPermission = name === "EditAdmins" || name === "TransferFacilities";
            const permission = roleFormik.values.permissions.find((perm: Permission) => perm.id === name);

            const roleToEditPermission = roleToEdit?.permissions?.find((perm: Permission) => {
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
                    key={`toggle-${name}`}
                    permission={permission.id} // @ts-ignore
                    accessLevel={permission.accessLevel}
                    onChange={onPermissionChange} // This passes the `onPermissionChange` function defined in the parent
                    initialAccessLevel={
                      roleFormik.values.permissions.find((permission: Permission) => permission.id === name)
                        ?.accessLevel
                    }
                  />
                ) : (
                  <>
                    <PermissionSelector
                      key={`selector-${name}`}
                      onPermissionChange={onPermissionChange}
                      initialAccessLevel={
                        roleToEdit
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

        <div className="role-control-buttons">
          <button
            type="button"
            className="cancel__btn"
            onClick={() => {
              roleFormik.resetForm();
              setIsCreatingRole(false);
            }}
          >
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className={`save__btn ${roleFormik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={roleFormik.isSubmitting}
          >
            <span>Save Changes</span>
          </button>
        </div>
      </form>
      {/* Spinner */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-gray-700 flex items-center justify-center z-10">
          {/* <div className="spinner border-4 border-t-4 border-gray-500 border-solid rounded-full w-16 h-16 animate-spin"></div> */}
          <NiceSpinner></NiceSpinner>
        </div>
      )}
    </>
  );
};

export default RoleForm;
