import api from "./api";

export const generateSkillGap = async (
  targetRole
) => {
  const response = await api.post(
    "/skill-gap/analyze",
    {
      targetRole
    }
  );

  return response.data;
};

export const getLatestSkillGap = async () => {
  const response = await api.get(
    "/skill-gap/latest"
  );

  return response.data;
};

export const getSkillGapHistory = async () => {
  const response = await api.get(
    "/skill-gap/history"
  );

  return response.data;
};