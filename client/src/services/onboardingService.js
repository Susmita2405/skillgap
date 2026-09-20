import api from "./api";

export const getOnboardingData = async () => {
  const response = await api.get(
    "/onboarding/data"
  );

  return response.data;
};

export const getOnboardingStatus = async () => {
  const response = await api.get(
    "/onboarding/status"
  );

  return response.data;
};

export const completeOnboarding = async (data) => {
  const response = await api.post(
    "/onboarding/complete",
    data
  );

  return response.data;
};