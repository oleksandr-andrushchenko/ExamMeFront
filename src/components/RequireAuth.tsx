import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Permission from "../schema/Permission";

interface RequireAuthParams {
  permission: Permission,
}

export default function RequireAuth({ permission }: RequireAuthParams) {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    auth?.permissions?.find(_permission => _permission === permission)
      ? <Outlet/>
      : auth
        ? <Navigate to="/unauthorized" state={{ from: location }} replace/>
        : <Navigate to="/login" state={{ from: location }} replace/>
  );
}