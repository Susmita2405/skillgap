import api from "./api";


/*
|--------------------------------------------------------------------------
| GENERATE / REFRESH SKILL GAP
|--------------------------------------------------------------------------
*/

export const generateSkillGap = async (targetRole) => {

  const response =
    await api.post(
      "/skill-gap/analyze",
      {
        targetRole
      }
    );

  return response.data;
};


/*
|--------------------------------------------------------------------------
| GET LATEST SAVED SKILL GAP
|--------------------------------------------------------------------------
*/

export const getLatestSkillGap =
  async () => {

    const response =
      await api.get(
        "/skill-gap/latest"
      );

    return response.data;
  };


/*
|--------------------------------------------------------------------------
| GET SKILL GAP FOR ROLE
|--------------------------------------------------------------------------
*/

export const getSkillGapForRole =
  async (
    targetRole
  ) => {

    const response =
      await api.get(
        `/skill-gap/analyze?role=${encodeURIComponent(
          targetRole
        )}`
      );

    return response.data;
  };


/*
|--------------------------------------------------------------------------
| HISTORY
|--------------------------------------------------------------------------
*/

export const getSkillGapHistory =
  async () => {

    const response =
      await api.get(
        "/skill-gap/history"
      );

    return response.data;
  };