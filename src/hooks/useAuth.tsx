import { Context, useContext } from "react";
import { AuthContext, AuthProviderContextValue } from "../context/AuthProvider";

export default function useAuth(): AuthProviderContextValue {
  return useContext<AuthProviderContextValue>(AuthContext as Context<AuthProviderContextValue>);
};