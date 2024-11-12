import { FunctionComponent, useEffect, useState } from "react";
import { Permission, Role } from "../interfaces/RoleInterface";
import roleIcon from "../assets/roleIcon.svg";
import userAssignIcon from "../assets/userAssignIcon.svg";

interface RoleCardProps {
  role: Role;
}
// role?.name === "Admin" || role?.name === "Personel"

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
      <li>
        <h3 style={{ border: "1px solid red" }}>
          {role?.name === "Admin" || role?.name === "Personel" ? `Default Role` : `Custom Role`}
        </h3>

        <div>
          <img
            src={roleIcon}
            alt=""
          />
          <span>{role.name}</span>
          <div>
            <div className="flex">
              <img
                src={userAssignIcon}
                alt=""
              />
              <span>{role.usersAssigned}</span>
            </div>
            <div>Users Assigned</div>
          </div>
          <button
          //   onClick={null}
          >
            <span>Use as Template</span>
          </button>
        </div>

        {/* <h3>Permissions:</h3> */}
        <ul>
          {/* {role?.permissions?.map((permission: Permission) => (
            <li key={permission.id}>
              Permission ID: {permission.id}, Access Level: {permission.accessLevel}
            </li>
          ))} */}
        </ul>
      </li>
    );
};
