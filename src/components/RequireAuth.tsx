import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Permission from "../enum/Permission";
import Route from "../enum/Route";

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
        ? <Navigate to={Route.UNAUTHORIZED} state={{ from: location }} replace/>
        : <Navigate to={Route.LOGIN} state={{ from: location }} replace/>
  );
}