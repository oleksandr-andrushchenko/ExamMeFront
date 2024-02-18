import { createContext, useEffect, useState } from "react";
import Auth from "../schema/Auth";
import client from "../api/client";
import Me from "../schema/Me";
import getMe from "../api/getMe";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const cacheAuth = localStorage.getItem('auth');
  const [ auth, setAuth ] = useState<Auth | undefined>(cacheAuth ? JSON.parse(cacheAuth) : undefined);
  const [ meLoading, setMeLoading ] = useState<boolean>(!!auth);
  const [ me, setMe ] = useState<Me | undefined>();

  useEffect(() => {
    if (auth) {
      client.defaults.headers['Authorization'] = `Bearer ${auth.token}`;
      localStorage.setItem('auth', JSON.stringify(auth));
      setMeLoading(true);
      getMe()
        .then((me) => setMe(me))
        .catch(() => setAuth(undefined))
        .finally(() => setMeLoading(false))
      ;
    } else {
      delete client.defaults.headers['Authorization'];
      localStorage.removeItem('auth');
      setMe(undefined);
    }
  }, [ auth ]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, meLoading, me }}>
      {children}
    </AuthContext.Provider>
  )
}