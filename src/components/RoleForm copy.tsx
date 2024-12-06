import { FunctionComponent, useState } from "react";
import RoleIcons from "./RoleIcons";
import PermissionSelector from "./PermissionSelector";
import { Permission, Role } from "../interfaces/RoleInterface";
import { PermissionToggle } from "./PermissionToggle";
import { NiceSpinner } from "./NiceSpinner";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { accessLevelMapping, CUSTOM_IDENTIFIER, permissionsArray } from "../constants/const";
import * as Yup from "yup";
import { addRole } from "../services/api";
import { toast } from "react-toastify";

const RoleForm: FunctionComponent<{
  setIsCreatingRole: React.Dispatch<React.SetStateAction<boolean>>;
  addNewRole: any;
}> = ({ setIsCreatingRole, addNewRole }) => {
  const [loading, setLoading] = useState(false); // state to manage loading spinner visibility
  const notifySuccess = () => toast.success("Role created successfully !");
  const notifyError = () => toast.error("Oops! Something went wrong! Please try again !");

  const roleFormik = useFormik({
    initialValues: {
      roleName: "",
      roleIcon: 0,
      permissions: permissionsArray.map(({ name }) => ({
        id: name, // Permission name as the id (or use an enum if available) // accessLevel: "None", // Default access level
        accessLevel: name === "TransferFacilities" || name === "EditAdmins" ? 0 : "None", // Set to 'No' for binary permissions initially
      })),
    },

    validationSchema: Yup.object({
      roleName: Yup.string().required("Role name is required"),
    }),

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
        const permissionsPayload = {
          name: values.roleName,
          roleIcon: values.roleIcon,
          permissions: permissions,
        };

        const addRoleResponse: any | Role = await addRole(CUSTOM_IDENTIFIER, permissionsPayload);

        const newRole = addRoleResponse.data;
        // Optimistic UI: add new role immediately to parent state
        addNewRole(newRole as Role);

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
                    permission={permission.id}
                    accessLevel={permission.accessLevel}
                    onChange={onPermissionChange} // This passes the `onPermissionChange` function defined in the parent
                    initialPermission={
                      roleFormik.values.permissions.find((permission) => permission.id === name)?.accessLevel
                    }
                  />
                ) : (
                  <>
                    <PermissionSelector
                      key={`selector-${name}`}
                      onPermissionChange={onPermissionChange}
                      initialPermission={
                        roleFormik.values.permissions.find((permission) => permission.id === name)?.accessLevel
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
