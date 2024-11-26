import { FunctionComponent, useEffect } from "react";
import { Permission, Role } from "../interfaces/RoleInterface";
import "./comp__styles.scss";
import roleIcon from "../assets/roleIcon.svg";
import userAssignIcon from "../assets/userAssignIcon.svg";
import { formatNumberThousands } from "../utils/helpers";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";

interface RoleCardProps {
  role: Role;
}

export const RoleCard: FunctionComponent<RoleCardProps> = ({ role }) => {
  //   const [roleIcon, setRoleIcon] = useState("");
  //   const setRoleIconByName = () => {
  //     switch (role.name) {
  //       case "Admin":
  //         setRoleIcon();
  //         break;
  //       case "Personel":
  //         setRoleIcon();
  //         break;
  //       case "Admin":
  //         setRoleIcon();
  //         break;
  //       case "Admin":
  //         setRoleIcon();
  //         break;
  //       case "Admin":
  //         setRoleIcon();
  //         break;
  //       default:
  //         break;
  //     }
  //   };

  useEffect(() => {
    // setRoleIconByName();
  }, []);

  if (role)
    return (
      <li className="role__card-container">
        <div className="role__header__icons">
          <h3 className="role-header">
            {role?.name === "Admin" || role?.name === "Personel" ? `Default Role` : `Custom Role`}
          </h3>

          {role?.name === "Admin" || role?.name === "Personel" ? null : (
            <div className="control__icons flex">
              <button className="edit-icon transform transition-transform duration-300 hover:scale-110">
                <img
                  src={editIcon}
                  alt="Edit"
                  width="20px"
                />
              </button>
              <button className="delete-icon transform transition-transform duration-300 hover:scale-110 ">
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
      </li>
    );
};
