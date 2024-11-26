import { FunctionComponent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RoleIcons from "./RoleIcons";
import { addRole } from "../services/api";
import { CUSTOM_IDENTIFIER } from "../constants/const";
import PermissionSelector from "./PermissionSelector";

const RoleForm: FunctionComponent = () => {
  const formik = useFormik({
    initialValues: {
      roleName: "",
      roleIcon: 0, // Default to the first icon
      locksPermission: "None",
    },
    validationSchema: Yup.object({
      roleName: Yup.string().required("Role name is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          name: values.roleName,
          roleIcon: values.roleIcon,
          permissions: [], // Empty array as per requirements
        };
        await addRole(CUSTOM_IDENTIFIER, payload); // Replace "custom_identifier" with your logic
        alert("Role added successfully!");
        resetForm();
      } catch (error) {
        console.error("Error adding role:", error);
        alert("Failed to add role.");
      } finally {
        setSubmitting(false);
      }
    },
  });

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
        {formik.touched.roleName && formik.errors.roleName ? (
          <div className="text-red-500 text-sm">{formik.errors.roleName}</div>
        ) : null}
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

      {/* Permissions Section */}
      <div>
        <PermissionSelector
          permissionName="Locks"
          initialPermission={formik.values.locksPermission}
          onPermissionChange={(permission: string) => formik.setFieldValue("locksPermission", permission)} // Update Formik state
        />
      </div>

      <div>
        <PermissionSelector
          permissionName="Tenant Locks"
          initialPermission={formik.values.locksPermission}
          onPermissionChange={(permission: string) => formik.setFieldValue("locksPermission", permission)} // Update Formik state
        />
      </div>
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
