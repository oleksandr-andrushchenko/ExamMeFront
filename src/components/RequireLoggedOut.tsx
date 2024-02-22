import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Route from "../enum/Route";

export default () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  if (auth) {
    navigate(Route.HOME);
  }

  return <Outlet/>;
}