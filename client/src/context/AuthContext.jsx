import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  authApi
} from "../services/api.js";

const AuthContext =
  createContext(null);

export function AuthProvider({
  children
}) {
  const [
    user,
    setUser
  ] = useState(null);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Restore Existing Session
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const restoreSession =
      async () => {
        try {
          const response =
            await authApi.me();

             console.log("AUTH CONTEXT ME RESPONSE:", response);

          if (mounted) {
  setUser(response.user);
}
        } catch (error) {
          /*
           * A 401 here simply means
           * there is no active session.
           */
          if (
            mounted &&
            error?.response?.status !==
              401
          ) {
            console.error(
              "Session restoration failed:",
              error
            );
          }

          if (mounted) {
            setUser(null);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

const register = async (data) => {
  setError(null);

  try {
    const response = await authApi.register(data);

    console.log("AUTH CONTEXT REGISTER RESPONSE:", response);

    setUser(response.user);

    return response;
  } catch (error) {
    console.error("AUTH CONTEXT REGISTER ERROR:", error);

    const message =
      error?.response?.data?.message ||
      error?.friendlyMessage ||
      "Registration failed.";

    setError(message);
    throw error;
  }
};

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

const login = async (data) => {
  setError(null);

  try {
    const response = await authApi.login(data);

    console.log("AUTH CONTEXT LOGIN RESPONSE:", response);

    setUser(response.user);

    return response;
  } catch (error) {
    console.error("AUTH CONTEXT LOGIN ERROR:", error);

    const message =
      error?.response?.data?.message ||
      error?.friendlyMessage ||
      "Login failed.";

    setError(message);
    throw error;
  }
};

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const value =
    useMemo(
      () => ({
        user,
        loading,
        error,
        isAuthenticated:
          Boolean(user),
        isAdmin:
          user?.role ===
          "admin",
        register,
        login,
        logout
      }),
      [
        user,
        loading,
        error
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}