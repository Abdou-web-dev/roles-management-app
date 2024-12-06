import * as Yup from "yup";

export const roleSchema = Yup.object({
  roleName: Yup.string().required("Role name is required").min(3, "Role name must be at least 3 characters long"),
});
