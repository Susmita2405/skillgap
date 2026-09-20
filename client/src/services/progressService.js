import api from "./api";

export const getProgress = async () => {
  const response =
    await api.get("/progress");

  return response.data;
};

export const updateSkillProgress =
  async (
    skillSlug,
    progress
  ) => {
    const response =
      await api.patch(
        `/progress/skills/${skillSlug}`,
        {
          progress
        }
      );

    return response.data;
  };

export const updateProjectProgress =
  async (
    projectId,
    progress,
    status
  ) => {
    const response =
      await api.patch(
        `/progress/projects/${projectId}`,
        {
          progress,
          status
        }
      );

    return response.data;
  };

export const updateRoadmapProgress =
  async (progress) => {
    const response =
      await api.patch(
        "/progress/roadmap",
        {
          progress
        }
      );

    return response.data;
  };