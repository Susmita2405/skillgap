import api from "./api";

export const compareRoles = async (role1, role2) => {
  const response = await api.get("/role-comparison", {
    params: {
      role1,
      role2
    }
  });

  return response.data;
};