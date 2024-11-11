import { useState, useEffect } from "react";
import axios from "axios";
import { Permission, Role } from "../interfaces/RoleInterface";
import { NiceSpinner } from "../components/NiceSpinner";

const Team = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // separate this logic in api.ts file
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://googlereviewsolicitor.azurewebsites.net/api/Roles?identifier=abdelmounim_sifelhak"
        );
        // const response = await axios.get("/api/Roles?identifier=abdelmounim_sifelhak");

        setRoles(response.data);
        console.log(roles);
      } catch (error) {
        setError("Failed to fetch roles.");
        console.log(error, "the error is");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading) return <NiceSpinner />;
  if (error) return <div>{error}</div>;

  return (
    <div className="">
      <h1>User Roles</h1>
      <div>
        <h1>Roles for abdelmounim_sifelhak</h1>
        <ul>
          {roles.map((role) => (
            <li key={role?.id}>
              <h2>{role?.name}</h2>
              <p>Custom Role: {role?.isCustom ? "Yes" : "No"}</p>
              <p>Role Icon: {role?.roleIcon}</p>
              <p>Users Assigned: {role?.usersAssigned}</p>
              <h3>Permissions:</h3>
              <ul>
                {role?.permissions?.map((permission: Permission) => (
                  <li key={permission.id}>
                    Permission ID: {permission.id}, Access Level: {permission.accessLevel}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Team;
