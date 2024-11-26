import { FunctionComponent, useState } from "react";

interface PermissionSelectorProps {
  permissionName: string; // Name of the permission (e.g., "Locks")
  initialPermission: string; // Initial value for the permission (e.g., "None")
  onPermissionChange: (permission: string) => void; // Callback to update permission state
}

const PermissionSelector: FunctionComponent<PermissionSelectorProps> = ({
  permissionName,
  initialPermission,
  onPermissionChange,
}) => {
  // Local state for tracking selected permission
  const [selectedPermission, setSelectedPermission] = useState(initialPermission);

  const handleClick = (permission: string) => {
    setSelectedPermission(permission);
    onPermissionChange(permission); // Notify parent component (Formik form) of the change
  };

  const getColor = (permission: string) => {
    return selectedPermission === permission ? "#33C173" : "#ABAFB1"; // Green if selected, grey if not
  };

  return (
    <div className="flex flex-col justify-between items-center space-x-4">
      <label className="">{permissionName}</label>

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
