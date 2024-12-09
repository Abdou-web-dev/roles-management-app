import { FunctionComponent } from "react";
import RoleIcons from "./RoleIcons";
import { Permission, Role, RoleInitialValues, updateRoleDataPayload } from "../interfaces/RoleInterface";
import { NiceSpinner } from "./NiceSpinner";
import { getInitialPermissionsForRole, transformPermissions, validateRoleName } from "../utils/role/roleUtils";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { CUSTOM_IDENTIFIER } from "../constants/const";
import { addRole, updateRole } from "../services/api";
import { toast } from "react-toastify";
import RoleName from "./RoleName";
import Permissions from "./Permissions";
import ControlButtons from "./ControlButtons";
import { useLoading } from "../hooks/useLoading";

const RoleForm: FunctionComponent<{
  roleToEdit?: Role | null;
  templateRole: Role | null;
  setIsCreatingRole: React.Dispatch<React.SetStateAction<boolean>>;
  processRole: (newRole: Role) => void;
  existingRoles: Role[];
}> = ({ setIsCreatingRole, processRole, roleToEdit, templateRole, existingRoles }) => {
  const currentRole = roleToEdit ? roleToEdit : templateRole ? templateRole : null;
  const notify = (message: string, type: "success" | "error" | "info") => {
    type === "success" ? toast.success(message) : type === "info" ? toast.info(message) : toast.error(message);
  };

  const { hideLoader, loading: formLoading, showLoader } = useLoading();

  const initialPermissions = getInitialPermissionsForRole(currentRole) as Permission[];

  const initialValues: RoleInitialValues = {
    roleName: currentRole?.name || "",
    roleIcon: currentRole?.roleIcon || 0,
    permissions: initialPermissions || [],
  };

  const roleFormik = useFormik({
    initialValues: initialValues,
    // validationSchema: roleSchema,
    enableReinitialize: true,
    validateOnChange: false, // Disable validation on field change
    validateOnBlur: false, // Disable validation on blur
    validate: (values) => {
      const errors: { roleName?: string } = {};
      // The reason for passing null as currentRole when creating a role based on another is to avoid the validation of the role name against the template role itself, ensuring the system doesn’t mistakenly treat the template as a duplicate when simply creating a new role based on it.
      const currentRole = templateRole ? null : roleToEdit;
      const roleNameError = validateRoleName(values.roleName, existingRoles, currentRole, notify);

      if (roleNameError) {
        errors.roleName = roleNameError;
      }

      return errors;
    },

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // the onSubmit will be called only if the errors object is empty and the rules defined inside the manual validate method are respected  !
      // Check if the form values are unchanged , upon editing an exisitng role
      const noChanges: boolean = JSON.stringify(values) === JSON.stringify(roleFormik.initialValues);

      if (noChanges && roleToEdit) {
        notify("No changes detected. Please modify fields before saving.", "error");
        setSubmitting(false);
        return; // Exit early
      }
      showLoader();
      const transformedPermissions = transformPermissions(values?.permissions);
      try {
        const payload = {
          name: values?.roleName,
          roleIcon: values?.roleIcon,
          permissions: transformedPermissions,
          ...(roleToEdit && { id: roleToEdit?.id }), // Include `id` only if editing
        };
        const apiCall = roleToEdit ? updateRole : templateRole ? addRole : addRole; // Determine API method
        const roleResponse: any | Role = await apiCall(CUSTOM_IDENTIFIER, payload as updateRoleDataPayload);

        if (roleResponse?.data) {
          const finalRole = roleResponse?.data; //finalRole holds either the response of the newly created role or the updated role
          processRole(finalRole as Role); // Optimistic UI update
          notify(`Role ${roleToEdit ? "updated" : templateRole ? "created" : "created"} successfully!`, "success");
        } else {
          console.error("API error:", roleResponse?.error || "Unknown error");
          notify("Something went wrong. Please try again!", "error");
        }
      } catch (error) {
        console.error("Error adding role:", error);
        notify("Oops! Something went wrong. Please try again!", "error");
        hideLoader(); // Ensure the spinner is hidden on error
      } finally {
        setSubmitting(false);
        setTimeout(() => {
          resetForm(); // Reset form after submission
          setIsCreatingRole(false); // Return to the role list view
          hideLoader();
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

  return (
    <>
      <form
        onSubmit={roleFormik.handleSubmit}
        className={`space-y-4 role-form-container transition-opacity ${formLoading ? "opacity-80" : "opacity-100"} `}
      >
        <RoleName {...{ loading: formLoading, roleFormik }}></RoleName>

        <div className="role-icons-container">
          <RoleIcons
            {...{ formLoading }}
            selectedIcon={roleFormik.values.roleIcon}
            setSelectedIcon={(iconIndex: number) => roleFormik.setFieldValue("roleIcon", iconIndex)}
          />
        </div>

        <h2>Permissions</h2>
        <Permissions {...{ formLoading, onPermissionChange, roleFormik, currentRole }} />

        <ControlButtons {...{ formLoading, roleFormik, setIsCreatingRole }} />
      </form>
      {/* Spinner */}
      {formLoading && (
        <div
          style={{ position: "relative", bottom: "400px" }}
          className="z-10 flex items-center justify-center "
        >
          <NiceSpinner />
        </div>
      )}
    </>
  );
};

export default RoleForm;
