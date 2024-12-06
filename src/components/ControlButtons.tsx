import { FunctionComponent } from "react";
import { RoleFormik } from "../interfaces/RoleInterface";

interface ControlButtonsProps {
  roleFormik: RoleFormik;
  setIsCreatingRole: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlButtons: FunctionComponent<ControlButtonsProps> = ({ roleFormik, setIsCreatingRole }) => {
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
        className={`save__btn ${roleFormik.isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={roleFormik.isSubmitting}
      >
        <span>Save Changes</span>
      </button>
    </div>
  );
};

export default ControlButtons;
