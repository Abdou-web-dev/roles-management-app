import { FunctionComponent, useState } from "react";
import { AccessLevel, Permission, PermissionType } from "../interfaces/RoleInterface";

interface PermissionToggleProps {
  permission: string;
  accessLevel: number | string;
  onChange: (updatedPermission: Permission) => void;
  initialPermission: string | AccessLevel | undefined; // Initial value for the permission (e.g., "None")
}

export const PermissionToggle: FunctionComponent<PermissionToggleProps> = ({
  permission,
  accessLevel,
  onChange,
  initialPermission,
}) => {
  const [selectedPermission, setSelectedPermission] = useState<string | AccessLevel | undefined>(initialPermission);

  const handleClick = (accessLevelValue: AccessLevel | string) => {
    const permissionObj: Permission = {
      id: permission, // Use the permission string as the unique id
      accessLevel: accessLevelValue, // Set the accessLevel to "None", "Read", or "Write"
    };

    // Pass the updated permission to the parent handler
    onChange(permissionObj); // This calls the onPermissionChange function passed from the parent
    setSelectedPermission(accessLevelValue);
  };

  return (
    <div className="flex space-x-4 mt-2">
      <button
        onClick={() => handleClick(1)} // For "Yes"
        disabled={accessLevel === 1} // Disable if already set to "Yes"
        type="button"
        className={`px-4 py-2 rounded-md font-medium ${
          accessLevel === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        Yes
      </button>
      <button
        onClick={() => handleClick(0)} // For "No"
        disabled={accessLevel === 0} // Disable if already set to "No"
        type="button"
        className={`px-4 py-2 rounded-md font-medium ${
          accessLevel === 0 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        No
      </button>
    </div>
  );
};
