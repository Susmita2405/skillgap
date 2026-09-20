import api from "./api";

export const getActivities = async (
  limit = 30
) => {
  const response = await api.get(
    "/activities",
    {
      params: {
        limit
      }
    }
  );

  return response.data;
};