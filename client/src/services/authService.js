import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


export const logout = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    throw error;
  }
};


export const login = async (
  email,
  password
) => {
  const response = await axios.post(
    `${API_URL}/auth/login`,
    {
      email,
      password
    },
    {
      withCredentials: true
    }
  );

  return response.data;
};


/*
  Register accepts the object used by Register.jsx:

  {
    name,
    email,
    password
  }
*/
export const register = async ({
  name,
  email,
  password
}) => {

  const response = await axios.post(
    `${API_URL}/auth/register`,
    {
      name,
      email,
      password
    },
    {
      withCredentials: true
    }
  );

  return response.data;
};


export const getCurrentUser = async () => {
  const response = await axios.get(
    `${API_URL}/auth/me`,
    {
      withCredentials: true
    }
  );

  return response.data;
};