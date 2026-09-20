import api from "./api";

export const getCareerAnalytics =
  async () => {
    const response =
      await api.get(
        "/analytics/career"
      );

    return response.data;
  };

export const getAnalyticsChartData =
  async () => {
    const response =
      await api.get(
        "/analytics/charts"
      );

    return response.data;
  };