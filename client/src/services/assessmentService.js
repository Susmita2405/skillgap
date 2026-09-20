import api from "./api";

export const getAssessmentQuestions = async (
  roleSlug
) => {
  const response = await api.get(
    `/assessment/questions/${roleSlug}`
  );

  return response.data;
};

export const submitAssessment = async (
  targetRole,
  answers
) => {
  const response = await api.post(
    "/assessment/submit",
    {
      targetRole,
      answers
    }
  );

  return response.data;
};

export const getMyAssessments = async () => {
  const response = await api.get(
    "/assessment/mine"
  );

  return response.data;
};

export const getLatestAssessment = async () => {
  const response = await api.get(
    "/assessment/latest"
  );

  return response.data;
};