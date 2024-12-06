import { FunctionComponent } from "react";
import { RoleFormik } from "../interfaces/RoleInterface";

interface RoleNameProps {
  roleFormik: RoleFormik;
}

const RoleName: FunctionComponent<RoleNameProps> = ({ roleFormik }) => {
  const inputError = roleFormik.touched.roleName && roleFormik.errors.roleName;

  return (
    <div className="custom-role-name">
      <label htmlFor="roleName">Custom Role Name</label>
      <input
        type="text"
        id="roleName"
        name="roleName"
        placeholder="Input Custom Role Name"
        className={` mt-1 block w-full rounded-md ${inputError ? "input__error" : ""}`}
        value={roleFormik.values.roleName}
        onChange={roleFormik.handleChange}
        onBlur={roleFormik.handleBlur}
      />
      {roleFormik.touched.roleName && roleFormik.errors.roleName && (
        <div className="role__name_error">{roleFormik.errors.roleName}</div>
      )}
    </div>
  );
};

export default RoleName;
