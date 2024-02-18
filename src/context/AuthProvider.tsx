import { createContext, useEffect, useState } from "react";
import Auth from "../schema/Auth";
import client from "../api/client";
import Me from "../schema/Me";
import getMe from "../api/getMe";
import Permission from "../enum/Permission";
import getPermissionHierarchy from "../api/getPermissionHierarchy";
import PermissionHierarchy from "../types/PermissionHierarchy";
import { AuthHook } from "../hooks/useAuth";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const cacheAuth = localStorage.getItem('auth');
  const [ auth, setAuth ] = useState<Auth | undefined>(cacheAuth ? JSON.parse(cacheAuth) : undefined);
  const [ meLoading, setMeLoading ] = useState<boolean>(!!auth);
  const [ me, setMe ] = useState<Me | undefined>();
  const [ permissionHierarchy, setPermissionHierarchy ] = useState<PermissionHierarchy | undefined>();

  const checkAuth = function (permission: Permission, userPermissions: Permission[] = undefined): boolean {
    if (!auth || !me || !permissionHierarchy) {
      return false;
    }

    userPermissions = userPermissions ? userPermissions : me?.permissions;

    if (userPermissions.indexOf(Permission.ALL) !== -1) {
      return true;
    }

    if (userPermissions.indexOf(permission) !== -1) {
      return true;
    }

    for (const userPermission of userPermissions) {
      if (permissionHierarchy.hasOwnProperty(userPermission)) {
        if (checkAuth(permission, permissionHierarchy[userPermission])) {
          return true;
        }
      }
    }

    return false;
  }

  useEffect(() => {
    if (auth) {
      client.defaults.headers['Authorization'] = `Bearer ${auth.token}`;
      localStorage.setItem('auth', JSON.stringify(auth));
      setMeLoading(true);
      Promise.all<Me | PermissionHierarchy>([ getMe(), getPermissionHierarchy() ])
        .then(([ me, permissionHierarchy ]) => {
          setMe(me as Me);
          setPermissionHierarchy(permissionHierarchy as PermissionHierarchy);
        })
        .catch(() => setAuth(undefined))
        .finally(() => setMeLoading(false))
      ;
    } else {
      delete client.defaults.headers['Authorization'];
      localStorage.removeItem('auth');
      setMe(undefined);
    }
  }, [ auth ]);

  const value: AuthHook = { auth, setAuth, meLoading, me, checkAuth };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}