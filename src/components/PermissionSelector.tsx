import { FunctionComponent, useState } from "react";
import { AccessLevel, Permission, PermissionType } from "../interfaces/RoleInterface";

interface PermissionSelectorProps {
  initialAccessLevel: string | AccessLevel | undefined; // Initial value for the permission (e.g., "None")
  onPermissionChange: (newPermission: any) => void;
  permissionType: PermissionType | string;
}

const PermissionSelector: FunctionComponent<PermissionSelectorProps> = ({
  initialAccessLevel,
  onPermissionChange,
  permissionType,
}) => {
  // Local state for tracking selected permission
  const [selectedPermission, setSelectedPermission] = useState<string | AccessLevel | undefined>(initialAccessLevel);

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

  // const getColor = (permission: string) => {
  //   return selectedPermission === permission ? "#33C173" : "#ABAFB1"; // Green if selected, grey if not
  // };

  return (
    <div className="flex flex-col justify-between  permission-selector-container">
      <div className="">
        <button
          // Warning: You submitted a Formik form using a button with an unspecified `type` attribute.  Most browsers default button elements to `type="submit"`. If this is not a submit button, please add `type="button"`.
          type="button"
          className={`none__button ${
            selectedPermission === "None" ? "none__active-button-class" : "none__inactive-button-class"
          }`}
          onClick={() => handleClick("None")}
          // style={{ backgroundColor: getColor("None") }}
        >
          <span>None</span>
        </button>
        <button
          type="button"
          className={`view__button ${
            selectedPermission === "View" ? "view__active-button-class" : "view__inactive-button-class"
          }`}
          onClick={() => handleClick("View")}
        >
          <span>View</span>
        </button>
        <button
          type="button"
          className={`edit__button ${
            selectedPermission === "Edit" ? "edit__active-button-class" : "edit__inactive-button-class"
          }`}
          onClick={() => handleClick("Edit")}
        >
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
};

export default PermissionSelector;
