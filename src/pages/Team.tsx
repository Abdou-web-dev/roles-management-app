import React, { useState, useEffect } from "react";
import { Role } from "../interfaces/RoleInterface";
import { NiceSpinner } from "../components/NiceSpinner";
import { getRoles } from "../services/api";
import { CUSTOM_IDENTIFIER } from "../constants/const";
import { RoleCard } from "../components/RoleCard";
import "./pages__styles.scss";
import RoleForm from "../components/RoleForm";
import back from "../assets/back.svg";
import AddCustomRoleButton from "../components/AddCustomRoleButton";
import { useLoading } from "../hooks/useLoading";

const Team = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [templateRole, setTemplateRole] = useState<Role | null>(null);

  const { hideLoader, loading, showLoader } = useLoading();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        showLoader();
        const response = await getRoles(CUSTOM_IDENTIFIER);

        setRoles(response.data);
        console.log(response && response.data);
      } catch (error) {
        setError("Failed to fetch roles.");
      } finally {
        setTimeout(() => {
          hideLoader();
        }, 1050);
      }
    };

    fetchRoles();
  }, []);

  const handleAddRoleClick = () => setIsCreatingRole(true);
  const handleBackClick = () => setIsCreatingRole(false);

  const handleProcessRole = (newRole: Role) => {
    // Optimistic UI update: add the role immediately to the roles state
    setRoles((prevRoles: Role[]) => {
      const existingRoleIndex = prevRoles?.findIndex((role) => role?.id === newRole?.id);
      if (existingRoleIndex !== -1) {
        // Update existing role
        const updatedRoles: Role[] = [...prevRoles];
        updatedRoles[existingRoleIndex] = newRole;
        return updatedRoles;
      } else {
        // Add new role
        const newRoles: Role[] = [newRole, ...prevRoles];

        return newRoles;
      }
    });
  };

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
      {!isCreatingRole && <h1 className="h1">User Roles</h1>}
      <div className="roles-tile-list-wrapper">
        {!isCreatingRole ? (
          // Roles tile list View
          <ul className="roles-grid-ul grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {roles?.map((role: Role, index: number) => {
              return (
                <React.Fragment key={index + role.id}>
                  <RoleCard
                    {...{ setRoles, setIsCreatingRole, setRoleToEdit, setTemplateRole }}
                    role={role}
                  />
                </React.Fragment>
              );
            })}

            {/* Add the button after the roles are rendered */}
            <AddCustomRoleButton {...{ setRoleToEdit, handleAddRoleClick, setTemplateRole }} />
          </ul>
        ) : (
          // Role form View
          <div className="create-custom-role-page pr-2">
            <div className="btn_and_title">
              <h2 className="font-bold mb-4">
                {roleToEdit
                  ? "Edit Custom Role"
                  : templateRole
                  ? "Create Custom Role based off another role :"
                  : "Create Custom Role"}
              </h2>
              <button
                className="back__button"
                onClick={handleBackClick}
              >
                <img
                  src={back}
                  alt=""
                />
                <span>Back</span>
              </button>
            </div>
            <h3>Configure general information and permissions below. Don’t forget to save the Custom Role.</h3>
            <RoleForm
              {...{ setIsCreatingRole, roleToEdit, templateRole, existingRoles: roles }}
              processRole={handleProcessRole}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
