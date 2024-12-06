import { FunctionComponent, useEffect } from "react";
import RoleIcons from "./RoleIcons";
import { Permission, Role, RoleInitialValues, updateRoleDataPayload } from "../interfaces/RoleInterface";
import { NiceSpinner } from "./NiceSpinner";
import { getInitialPermissionsForRole, transformPermissions } from "../utils/role/roleUtils";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import { CUSTOM_IDENTIFIER } from "../constants/const";
import { addRole, updateRole } from "../services/api";
import { toast } from "react-toastify";
import RoleName from "./RoleName";
import Permissions from "./Permissions";
import ControlButtons from "./ControlButtons";
import { useLoading } from "../hooks/useLoading";
import { roleSchema } from "../validations/roleValidation";

const RoleForm: FunctionComponent<{
  roleToEdit?: Role | null;
  setIsCreatingRole: React.Dispatch<React.SetStateAction<boolean>>;
  processRole: (newRole: Role) => void;
}> = ({ setIsCreatingRole, processRole, roleToEdit }) => {
  const notify = (message: string, type: "success" | "error" | "info") => {
    type === "success" ? toast.success(message) : type === "info" ? toast.info(message) : toast.error(message);
  };

  const { hideLoader, loading: formLoading, showLoader } = useLoading();

  const initialPermissions = getInitialPermissionsForRole(roleToEdit) as Permission[];

  const initialValues: RoleInitialValues = {
    roleName: roleToEdit?.name || "",
    roleIcon: roleToEdit?.roleIcon || 0,
    permissions: initialPermissions,
  };

  const roleFormik = useFormik({
    initialValues: initialValues,
    validationSchema: roleSchema,
    enableReinitialize: true, // Ensures form re-initializes when `roleToEdit` changes
    validateOnChange: false, // Disable validation on field change
    validateOnBlur: false, // Disable validation on blur
    validate: (values) => {
      const errors: { roleName?: string } = {};

      // Early check for empty roleName before Yup validation
      if (!values.roleName.trim()) {
        errors.roleName = "Role name is required"; // Set custom error message
        notify("You must enter a name for this role!", "error"); // Show toast
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Check if the form values are unchanged , upon editing an exisitng role
      const noChanges: boolean = JSON.stringify(values) === JSON.stringify(roleFormik.initialValues);

      if (noChanges) {
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
        const apiCall = roleToEdit ? updateRole : addRole; // Determine API method
        const roleResponse: any | Role = await apiCall(CUSTOM_IDENTIFIER, payload as updateRoleDataPayload);

        if (roleResponse?.data) {
          const finalRole = roleResponse?.data; //finalRole holds either the response of the newly created role or the updated role
          processRole(finalRole as Role); // Optimistic UI update
          notify(`Role ${roleToEdit ? "updated" : "created"} successfully!`, "success");
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
        <Permissions {...{ formLoading, onPermissionChange, roleFormik, roleToEdit }} />

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
