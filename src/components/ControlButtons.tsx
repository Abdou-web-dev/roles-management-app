import { FunctionComponent, useEffect } from "react";
import { Role, RoleFormik } from "../interfaces/RoleInterface";

interface ControlButtonsProps {
  roleFormik: RoleFormik;
  formLoading: boolean;
  setIsCreatingRole: React.Dispatch<React.SetStateAction<boolean>>;
  setRoleToEdit: React.Dispatch<React.SetStateAction<Role | null>>;
  setTemplateRole: React.Dispatch<React.SetStateAction<Role | null>>;
}

const ControlButtons: FunctionComponent<ControlButtonsProps> = ({
  roleFormik,
  setIsCreatingRole,
  formLoading,
  setRoleToEdit,
  setTemplateRole,
}) => {
  return (
    <div className="role-control-buttons">
      <button
        disabled={formLoading}
        type="button"
        className={`cancel__btn ${formLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => {
          roleFormik.resetForm();
          setIsCreatingRole(false);
          setRoleToEdit(null);
          setTemplateRole(null);
        }}
      >
        <span>Cancel</span>
      </button>
      <button
        type="submit"
        style={{ cursor: formLoading ? "not-allowed" : "" }}
        className={`save__btn ${formLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={formLoading}
      >
        <span>Save Changes</span>
      </button>
    </div>
  );
};

export default ControlButtons;
