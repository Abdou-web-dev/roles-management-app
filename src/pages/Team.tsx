import React, { useState, useEffect } from "react";
import { Role } from "../interfaces/RoleInterface";
import { NiceSpinner } from "../components/NiceSpinner";
import { getRoles } from "../services/api";
import { CUSTOM_IDENTIFIER } from "../constants/const";
import { RoleCard } from "../components/RoleCard";
import "./pages__styles.scss";
import plus__icon from "../assets/plus__icon.svg";

const Team = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await getRoles(CUSTOM_IDENTIFIER);

        setRoles(response.data);
        console.log(response && response.data);
      } catch (error) {
        setError("Failed to fetch roles.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1050);
      }
    };

    fetchRoles();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center mt-32">
        <NiceSpinner />
      </div>
    );
  if (error)
    return <div className="text-red-600 flex justify-center items-center mt-32 text-lg font-bold">{error}</div>;

  return (
    <div className="team__page">
      <h1 className="h1">User Roles</h1>
      <div className="roles-tile-list-wrapper">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {roles.map((role, index) => (
            <React.Fragment key={role.id}>
              <RoleCard role={role} />
              {/* The conditional {index === roles.length - 1 && ...} ensures the button is displayed only after the last role. */}
              {index === roles.length - 1 && (
                <button
                  className="add__custom_role_button col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-1 justify-self-start border rounded-lg p-4 
              h-full w-full shadow-sm hover:shadow-md "
                >
                  <img
                    src={plus__icon}
                    alt=""
                    className="mr-2"
                  />
                  <span> Add Custom Role</span>
                </button>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Team;
