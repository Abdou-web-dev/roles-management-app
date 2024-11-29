import { FunctionComponent, useEffect, useState } from "react";
import { Role } from "../interfaces/RoleInterface";
import "./comp__styles.scss";
import roleIcon from "../assets/roleIcon.svg";
import userAssignIcon from "../assets/userAssignIcon.svg";
import { formatNumberThousands } from "../utils/helpers";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";
import { deleteRole } from "../services/api";
import { CUSTOM_IDENTIFIER } from "../constants/const";
import { toast } from "react-toastify";

interface RoleCardProps {
  role: Role;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const RoleCard: FunctionComponent<RoleCardProps> = ({ role, setRoles }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const deleteError = () =>
    toast.error("Failed to delete role. Please try again.", {
      position: "top-right",
    });
  const handleDeleteRole = async () => {
    try {
      // Optimistically remove the role
      // remove the role from the UI

      setRoles((prevRoles: Role[]) => prevRoles.filter((r: Role) => r.id !== role.id));
      const deleteResponse = await deleteRole(CUSTOM_IDENTIFIER, role.id); // Call deleteRole with the API

      if (deleteResponse.data === "Role deleted successfully." && deleteResponse.status === 201) {
        toast.info("Role deleted successfully.", {
          position: "top-right",
        });
        setShowConfirmModal(false); // Close the modal upon successful delete
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      deleteError();
      // If the delete failed on the server side, then re-add the role to the UI
      setRoles((prevRoles) => [...prevRoles, role]);
      setShowConfirmModal(false);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false); // Close the modal if the user cancels
  };

  // Close the modal when 'Esc' is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowConfirmModal(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [setShowConfirmModal]);

  if (role)
    return (
      <li className="role__card-container">
        <div className="role__header__icons">
          <h3 className="role-header">
            {role?.name === "Admin" || role?.name === "Personel" ? `Default Role` : `Custom Role`}
          </h3>

          {role?.name === "Admin" || role?.name === "Personel" ? null : (
            <div className="control__icons flex">
              <button
                // onClick={editRole}

                className="edit-icon transform transition-transform duration-300 hover:scale-110"
              >
                <img
                  src={editIcon}
                  alt="Edit"
                  width="20px"
                />
              </button>
              <button
                onClick={() => setShowConfirmModal(true)} // Open confirmation modal
                className="delete-icon transform transition-transform duration-300 hover:scale-110 "
              >
                <img
                  src={deleteIcon}
                  alt="Delete"
                  width="20px"
                />
              </button>
            </div>
          )}
        </div>
        <div className="role-category flex flex-col justify-center items-center">
          <img
            className="role__icon"
            src={roleIcon}
            alt=""
          />
          <span className="admin__text">{role.name}</span>
          <div className="users_wrapper">
            <div className="flex flex-row justify-center items-center users_wrapper-inner">
              <img
                src={userAssignIcon}
                alt=""
                width={`20px`}
              />
              <span className="users_assigned">{formatNumberThousands(role.usersAssigned)}</span>
            </div>
            <p>Users Assigned</p>
          </div>
          <button className="use__as transform transition-transform duration-300 hover:scale-110 ">
            <span>Use as Template</span>
          </button>
        </div>
        {/* Delete Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal-background">
            <div className="modal-content">
              <h4>Are you sure you want to delete this role?</h4>
              <button
                onClick={handleDeleteRole}
                className={`delete__btn`}
              >
                <span>Yes, Delete</span>
              </button>
              <button
                className="cancel__btn"
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </li>
    );
};
