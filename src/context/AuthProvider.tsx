import { createContext, useEffect, useState } from "react";
import Auth from "../schema/Auth";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const cacheAuth = localStorage.getItem('auth');
  const [ auth, setAuth ] = useState<Auth>(cacheAuth ? JSON.parse(cacheAuth) : undefined);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth))
    } else {
      localStorage.removeItem('auth');
    }
  }, [ auth ]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}