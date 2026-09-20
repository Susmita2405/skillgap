import api from "./api";

export const getAdminContent =
  async (type) => {
    const response =
      await api.get(
        `/admin/content/${type}`
      );

    return response.data;
  };

export const createAdminContent =
  async (type, data) => {
    const response =
      await api.post(
        `/admin/content/${type}`,
        data
      );

    return response.data;
  };

export const updateAdminContent =
  async (
    type,
    id,
    data
  ) => {
    const response =
      await api.patch(
        `/admin/content/${type}/${id}`,
        data
      );

    return response.data;
  };

export const deleteAdminContent =
  async (
    type,
    id
  ) => {
    const response =
      await api.delete(
        `/admin/content/${type}/${id}`
      );

    return response.data;
  };