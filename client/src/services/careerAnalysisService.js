import api from "./api";

export const analyzeCareerProfile =
  async ({
    file,
    githubUsername,
    targetRole
  }) => {
    const formData = new FormData();

    formData.append(
      "resume",
      file
    );

    formData.append(
      "githubUsername",
      githubUsername
    );

    formData.append(
      "targetRole",
      targetRole
    );

    const response =
      await api.post(
        "/career-analysis/analyze",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          },

          timeout: 180000
        }
      );

    return response.data;
  };

export const getLatestCareerAnalysis =
  async () => {
    const response =
      await api.get(
        "/career-analysis/latest"
      );

    return response.data;
  };

export const getCareerAnalysisHistory =
  async () => {
    const response =
      await api.get(
        "/career-analysis/history"
      );

    return response.data;
  };