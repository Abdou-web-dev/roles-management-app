import { FunctionComponent } from "react";
import { RoleFormik } from "../interfaces/RoleInterface";

interface ControlButtonsProps {
  roleFormik: RoleFormik;
  formLoading: boolean;
  setIsCreatingRole: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlButtons: FunctionComponent<ControlButtonsProps> = ({ roleFormik, setIsCreatingRole, formLoading }) => {
  return (
    <div className="role-control-buttons">
      <button
        type="button"
        className="cancel__btn"
        onClick={() => {
          roleFormik.resetForm();
          setIsCreatingRole(false);
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
