import axios from "axios";
import { postRoleDataPayload, updateRoleDataPayload } from "../interfaces/RoleInterface";

const API_URL = "https://googlereviewsolicitor.azurewebsites.net/api/";

export const getRoles = (identifier: string) => {
  return axios.get(`${API_URL}Roles?identifier=${identifier}`);
};

export const addRole = (identifier: string, roleData: postRoleDataPayload) => {
  return axios.post(`${API_URL}AddRole?identifier=${identifier}`, roleData);
};

export const updateRole = (identifier: string, roleData: updateRoleDataPayload) => {
  return axios.put(`${API_URL}UpdateRole?identifier=${identifier}`, roleData);
};

export const deleteRole = (identifier: string, id: string) => {
  return axios.delete(`${API_URL}DeleteRole/${id}?identifier=${identifier}`);
};
