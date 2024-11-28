import { FunctionComponent, useState } from "react";
import { AccessLevel, Permission } from "../interfaces/RoleInterface";

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
    <div className="permission__toggle">
      <button
        onClick={() => handleClick(0)} // For "No"
        disabled={accessLevel === 0} // Disable if already set to "No"
        type="button"
        className={`no__btn ${accessLevel === 0 ? "no__active-button-class" : "no__inactive-button-class"}`}
      >
        <span>No</span>
      </button>

      <button
        onClick={() => handleClick(1)} // For "Yes"
        disabled={accessLevel === 1} // Disable if already set to "Yes"
        type="button"
        className={`yes__btn ${accessLevel === 1 ? "yes__active-button-class" : "yes__inactive-button-class"}`}
      >
        <span>Yes</span>
      </button>
    </div>
  );
};
