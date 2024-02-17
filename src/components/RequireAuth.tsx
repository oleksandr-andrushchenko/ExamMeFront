import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Permission from "../schema/Permission";
import RoutePath from "../schema/RoutePath";

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
        ? <Navigate to={RoutePath.UNAUTHORIZED} state={{ from: location }} replace/>
        : <Navigate to={RoutePath.LOGIN} state={{ from: location }} replace/>
  );
}