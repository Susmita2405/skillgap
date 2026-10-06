import api from "./api";


export const analyzeResume = async ({
  file,
  targetRole
}) => {
  const formData =
    new FormData();

  formData.append(
    "resume",
    file
  );

  formData.append(
    "targetRole",
    targetRole || ""
  );

  const response =
    await api.post(
      "/resume/analyze",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        },
        timeout: 120000
      }
    );

  return response.data;
};


export const getLatestResumeAnalysis =
  async () => {
    const response =
      await api.get(
        "/resume/latest"
      );

    return response.data;
  };


export const getResumeHistory =
  async () => {
    const response =
      await api.get(
        "/resume/history"
      );

    return response.data;
  };