import { FunctionComponent, useState } from "react";
import { AccessLevel, Permission, PermissionType } from "../interfaces/RoleInterface";

interface PermissionSelectorProps {
  initialPermission: string | AccessLevel | undefined; // Initial value for the permission (e.g., "None")
  onPermissionChange: (newPermission: any) => void;
  permissionType: PermissionType | string;
}

const PermissionSelector: FunctionComponent<PermissionSelectorProps> = ({
  initialPermission,
  onPermissionChange,
  permissionType,
}) => {
  // Local state for tracking selected permission
  const [selectedPermission, setSelectedPermission] = useState<string | AccessLevel | undefined>(initialPermission);

  const handleClick = (accessLevelValue: AccessLevel | string) => {
    const permissionObj: Permission = {
      id: permissionType as PermissionType | string, // Use the enum value as the unique id
      accessLevel: accessLevelValue, // "None", "Read", or "Write"
    };

    // Pass the updated permission to the parent handler
    onPermissionChange(permissionObj);

    // Update local state
    setSelectedPermission(accessLevelValue);
  };

  const getColor = (permission: string) => {
    return selectedPermission === permission ? "#33C173" : "#ABAFB1"; // Green if selected, grey if not
  };

  return (
    <div className="flex flex-col justify-between items-center space-x-4">
      <div className="flex gap-0">
        <div
          onClick={() => handleClick("None")}
          className="cursor-pointer text-center py-2 px-4 "
          style={{ backgroundColor: getColor("None") }}
        >
          <span>None</span>
        </div>
        <div
          onClick={() => handleClick("View")}
          className="cursor-pointer text-center py-2 px-4"
          style={{ backgroundColor: getColor("View") }}
        >
          <span>View</span>
        </div>
        <div
          onClick={() => handleClick("Edit")}
          className="cursor-pointer text-center py-2 px-4"
          style={{ backgroundColor: getColor("Edit") }}
        >
          <span>Edit</span>
        </div>
      </div>
    </div>
  );
};

export default PermissionSelector;
