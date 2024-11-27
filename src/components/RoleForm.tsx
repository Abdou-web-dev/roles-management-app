import { FunctionComponent, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RoleIcons from "./RoleIcons";
import { addRole } from "../services/api";
import { accessLevelMapping, CUSTOM_IDENTIFIER, permissionsArray } from "../constants/const";
import PermissionSelector from "./PermissionSelector";
import { Permission } from "../interfaces/RoleInterface";

const RoleForm: FunctionComponent = () => {
  const formik = useFormik({
    initialValues: {
      roleName: "",
      roleIcon: 0,
      permissions: permissionsArray.map(({ name }) => ({
        id: name, // Permission name as the id (or use an enum if available)
        accessLevel: "None", // Default access level
      })),
    },

    validationSchema: Yup.object({
      roleName: Yup.string().required("Role name is required"),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const permissions = values.permissions.map((permission) => ({
        id: permission.id,
        accessLevel: accessLevelMapping[permission.accessLevel as "None" | "View" | "Edit"], // Type assertion here
      }));

      try {
        const payload = {
          name: values.roleName,
          roleIcon: values.roleIcon,
          permissions: permissions,
        };
        await addRole(CUSTOM_IDENTIFIER, payload);
        console.log("Payload sent is:", payload);
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
    console.log(updatedPermission, "updatedPermission");
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

      {permissionsArray.map(({ name, label }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <PermissionSelector
            onPermissionChange={onPermissionChange}
            initialPermission={formik.values.permissions.find((permission) => permission.id === name)?.accessLevel}
            permissionType={name}
          />
        </div>
      ))}

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
