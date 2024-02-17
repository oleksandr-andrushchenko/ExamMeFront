import { Context, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Auth from "../schema/Auth";

interface UseAuthHook {
  auth: Auth,
  setAuth: (auth: Auth | undefined) => void,
}

export default function useAuth(): UseAuthHook {
  return useContext<UseAuthHook>(AuthContext as Context<UseAuthHook>);
};