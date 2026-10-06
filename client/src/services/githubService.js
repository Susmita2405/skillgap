import api from "./api";

export const analyzeGithub = async ({ username, targetRole }) => {
  const response = await api.post("/github/analyze", {
    username,
    targetRole
  });
  return response.data;
};

export const getLatestGithubAnalysis = async () => {
  const response = await api.get("/github/latest");
  return response.data;
};

export const getGithubHistory = async () => {
  const response = await api.get("/github/history");
  return response.data;
};
