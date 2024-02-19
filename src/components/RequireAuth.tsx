import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Permission from "../enum/Permission";
import Route from "../enum/Route";
import Spinner from "./Spinner";

interface RequireAuthParams {
  permission: Permission,
}

export default function RequireAuth({ permission }: RequireAuthParams) {
  const { auth, me, checkAuth } = useAuth();
  const location = useLocation();

  return (
    auth && me === undefined
      ? <Spinner/>
      : (
        checkAuth(permission)
          ? <Outlet/>
          : me
            ? <Navigate to={Route.UNAUTHORIZED} state={{ from: location }} replace/>
            : <Navigate to={Route.LOGIN} state={{ from: location }} replace/>
      )
  );
}