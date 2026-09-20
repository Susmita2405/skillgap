import api from "./api";

export const getCareers = async (params = {}) => {
  const response = await api.get("/careers", {
    params
  });

  return response.data;
};

export const getCareerCategories = async () => {
  const response = await api.get("/careers/categories");

  return response.data;
};

export const getCareerById = async (id) => {
  const response = await api.get(`/careers/${id}`);

  return response.data;
};