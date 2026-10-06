import api from "./api";

export const generateRoadmap = async (targetRole) => {
  const response = await api.post(
    "/roadmap/generate",
    { targetRole },
    { timeout: 120000 }
  );

  return response.data;
};

export const getLatestRoadmap = async () => {
  const response = await api.get(
    "/roadmap/latest"
  );

  return response.data;
};

export const getRoadmapByRole = async (targetRole) => {
  const response = await api.get(
    `/roadmap/role/${encodeURIComponent(targetRole)}`
  );

  return response.data;
};

export const updateRoadmapItem = async (
  roadmapId,
  itemId,
  status
) => {
  const response = await api.patch(
    `/roadmap/${roadmapId}/items/${itemId}`,
    { status }
  );

  return response.data;
};