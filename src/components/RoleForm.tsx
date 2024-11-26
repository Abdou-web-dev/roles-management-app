import { FunctionComponent } from "react";

interface RoleFormProps {}

const RoleForm: FunctionComponent<RoleFormProps> = () => {
  return (
    <form className="space-y-4">
      <div>
        <label
          htmlFor="roleName"
          className="block text-sm font-medium text-gray-700"
        >
          Custom Role Name
        </label>
        <input
          placeholder="Input Custom Role Name"
          type="text"
          id="roleName"
          name="roleName"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label
          htmlFor="roleIcon"
          className="block text-sm font-medium text-gray-700"
        >
          Select Role Icon
        </label>
        <input
          type="number"
          id="roleIcon"
          name="roleIcon"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label
          htmlFor="permissions"
          className="block text-sm font-medium text-gray-700"
        >
          Permissions
        </label>
        <textarea
          id="permissions"
          name="permissions"
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        ></textarea>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Save Role
      </button>
    </form>
  );
};

export default RoleForm;
