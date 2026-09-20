import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json"
  },

  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication required");
    }

    if (error.response?.status === 429) {
      console.warn(
        "Too many requests. Please wait."
      );
    }

    return Promise.reject(
      error
    );
  }
);

export const authApi = {
 register: async (data) => {
  console.log("REGISTER DATA:", data);
  console.log("REGISTER URL:", `${api.defaults.baseURL}/auth/register`);

  const response = await api.post(
    "/auth/register",
    data
  );

  console.log(
  "REGISTER RESPONSE:",
  JSON.stringify(response.data, null, 2)
);

  return response.data;
},

  login: async (
    data
  ) => {
    const response =
      await api.post(
        "/auth/login",
        data
      );

    return response.data;
  },

  logout: async () => {
    const response =
      await api.post(
        "/auth/logout"
      );

    return response.data;
  },

  me: async () => {
    const response =
      await api.get(
        "/auth/me"
      );

    return response.data;
  }
};

export const skillApi = {
  getMySkills: async () => {
    const response = await api.get("/skills/mine");
    return response.data;
  },

  addSkill: async (data) => {
    const response = await api.post("/skills", data);
    return response.data;
  },

  addMultipleSkills: async (skills) => {
    const response = await api.post("/skills/bulk", {
      skills
    });

    return response.data;
  },

  deleteSkill: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },

  analyze: async (role) => {
    const response = await api.get(
      `/skill-gap/analyze?role=${encodeURIComponent(role)}`
    );

    return response.data;
  }
};

export default api;