import api from "./api";

export const getProjects = async () => {
  const response =
    await api.get("/projects");

  return response.data;
};

export const getRecommendations =
  async (targetRole) => {
    const response =
      await api.post(
        "/projects/recommend",
        {
          targetRole
        }
      );

    return response.data;
  };

export const getLatestRecommendations =
  async () => {
    const response =
      await api.get(
        "/projects/recommendations"
      );

    return response.data;
  };