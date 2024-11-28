import { FunctionComponent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RoleIcons from "./RoleIcons";
import { addRole } from "../services/api";
import { accessLevelMapping, CUSTOM_IDENTIFIER, permissionsArray } from "../constants/const";
import PermissionSelector from "./PermissionSelector";
import { Permission } from "../interfaces/RoleInterface";
import { PermissionToggle } from "./PermissionToggle";

const RoleForm: FunctionComponent = () => {
  const formik = useFormik({
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
      const permissions = values.permissions.map((permission) => ({
        id: permission.id,
        // accessLevel: accessLevelMapping[permission.accessLevel as "None" | "View" | "Edit"], // Type assertion here, convert access level to number
        accessLevel:
          permission.id === "TransferFacilities" || permission.id === "EditAdmins"
            ? permission.accessLevel === 0
              ? 0
              : permission.accessLevel === 1
              ? 1
              : accessLevelMapping["None"]
            : accessLevelMapping[permission.accessLevel as "None" | "View" | "Edit"],
      }));

      try {
        const permissionsPayload = {
          name: values.roleName,
          roleIcon: values.roleIcon,
          permissions: permissions,
        };

        // console.log(permissionsPayload, "permissionsPayload just before submitting the form");
        await addRole(CUSTOM_IDENTIFIER, permissionsPayload);
        // console.log("Payload to be sent:", JSON.stringify(permissionsPayload, null, 2));

        resetForm();
      } catch (error) {
        console.error("Error adding role:", error);
        alert("Failed to add role.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const onPermissionChange = (updatedPermission: Permission) => {
    // Update the permission in Formik's state using setFieldValue
    const permissionIndex = formik.values.permissions.findIndex((permission) => permission.id === updatedPermission.id);
    if (permissionIndex >= 0) {
      formik.setFieldValue(`permissions[${permissionIndex}].accessLevel`, updatedPermission.accessLevel);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="roleName"
          className="block text-sm font-medium text-gray-700"
        >
          Custom Role Name
        </label>
        <input
          type="text"
          id="roleName"
          name="roleName"
          placeholder="Input Custom Role Name"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          value={formik.values.roleName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.roleName && formik.errors.roleName && (
          <div className="text-red-500 text-sm">{formik.errors.roleName}</div>
        )}
      </div>

      <div>
        <label
          htmlFor="roleIcon"
          className="block text-sm font-medium text-gray-700"
        >
          Select Role Icon
        </label>
        <RoleIcons
          selectedIcon={formik.values.roleIcon}
          setSelectedIcon={(iconIndex: number) => formik.setFieldValue("roleIcon", iconIndex)}
        />
      </div>

      <>
        {/* AAAAAAAAAA */}
        {permissionsArray?.map(({ name, label }) => {
          const isBinaryPermission = name === "EditAdmins" || name === "TransferFacilities";
          const permission = formik.values.permissions.find((perm: Permission) => perm.id === name);
          if (!permission) return null;

          return (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              {isBinaryPermission ? (
                <PermissionToggle
                  permission={permission.id}
                  accessLevel={permission.accessLevel}
                  onChange={onPermissionChange} // This passes the `onPermissionChange` function defined in the parent
                  initialPermission={
                    formik.values.permissions.find((permission) => permission.id === name)?.accessLevel
                  }
                />
              ) : (
                <>
                  {/* <label className="block text-sm font-medium text-gray-700">{label}</label> */}
                  <PermissionSelector
                    onPermissionChange={onPermissionChange}
                    initialPermission={
                      formik.values.permissions.find((permission) => permission.id === name)?.accessLevel
                    }
                    permissionType={name}
                  />
                </>
              )}
            </div>
          );
        })}
      </>

      <div>
        <button
          type="button"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          onClick={() => formik.resetForm()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
            formik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={formik.isSubmitting}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default RoleForm;
