import {
  Navigate,
  Outlet
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

import LoadingScreen from "../ui/LoadingScreen.jsx";

function AdminRoute() {
  const {
    isAuthenticated,
    isAdmin,
    loading
  } = useAuth();

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <Outlet />
  );
}

export default AdminRoute;