import api from "./api";

export const getResources = async (
  params = {}
) => {
  const response = await api.get(
    "/resources",
    {
      params
    }
  );

  return response.data;
};

export const getRecommendedResources =
  async () => {
    const response = await api.get(
      "/resources/recommended"
    );

    return response.data;
  };