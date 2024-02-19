import { Context, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Auth from "../schema/Auth";
import Me from "../schema/Me";
import Permission from "../enum/Permission";

export interface AuthHook {
  auth: Auth | undefined,
  setAuth: (auth: Auth | undefined) => void,
  me: Me | undefined,
  checkAuth: (permission: Permission) => boolean,
}

export default function useAuth(): AuthHook {
  return useContext<AuthHook>(AuthContext as Context<AuthHook>);
};