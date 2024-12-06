import { FunctionComponent } from "react";
import plus__icon from "../assets/plus__icon.svg";
import { Role } from "../interfaces/RoleInterface";

interface AddCustomRoleButtonProps {
  handleAddRoleClick: () => void;
  setRoleToEdit: React.Dispatch<React.SetStateAction<Role | null>>;
}

const AddCustomRoleButton: FunctionComponent<AddCustomRoleButtonProps> = ({ handleAddRoleClick, setRoleToEdit }) => {
  return (
    <button
      onClick={() => {
        setRoleToEdit(null);
        handleAddRoleClick();
      }}
      className="add__custom_role_button col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 justify-self-start border rounded-lg p-4 
             h-full w-full shadow-sm hover:shadow-md "
    >
      <img
        src={plus__icon}
        alt=""
        className="mr-2 mb-6"
      />
      <span> Add Custom Role</span>
    </button>
  );
};

export default AddCustomRoleButton;
