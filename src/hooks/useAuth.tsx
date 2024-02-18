import { Context, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Auth from "../schema/Auth";
import Me from "../schema/Me";

interface AuthHook {
  auth: Auth | undefined,
  setAuth: (auth: Auth | undefined) => void,
  meLoading: boolean,
  me: Me | undefined,
}

export default function useAuth(): AuthHook {
  return useContext<AuthHook>(AuthContext as Context<AuthHook>);
};