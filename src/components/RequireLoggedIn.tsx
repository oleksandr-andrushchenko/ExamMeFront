import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Permission from "../enum/Permission";
import Spinner from "./Spinner";
import Unauthorized from "../pages/Unauthorized";
import Login from "../pages/Login";

interface RequireAuthParams {
  permission: Permission,
}

export default ({ permission }: RequireAuthParams) => {
  const { auth, me, checkAuth } = useAuth();

  return (
    auth && me === undefined ? <Spinner/> : (checkAuth(permission) ? <Outlet/> : (me ? <Unauthorized/> : <Login/>))
  );
}