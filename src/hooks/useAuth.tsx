import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import Token from '../schema/auth/Token'
import Me from '../schema/me/Me'
import Permission from '../enum/Permission'
import { default as PermissionQuery } from '../schema/auth/Permission'
import { apiQuery } from '../api/apolloClient'
import authProviderQuery from '../api/auth/authProviderQuery'
import PermissionHierarchy from '../schema/auth/PermissionHierarchy'

const AuthContext = createContext({})

interface AuthProviderContextValue {
  auth: Token | undefined
  setAuth: (auth: Token | undefined) => void
  me: Me | undefined
  checkAuth: (permission: string, resource?: { ownerId?: string }, permissions?: string[]) => boolean
}

interface Data {
  me?: Me | undefined
  permissionHierarchy?: PermissionHierarchy | undefined
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authString = localStorage.getItem('auth')
  const [ auth, setAuth ] = useState<Token | undefined>(authString ? JSON.parse(authString) : undefined)
  const defaultData = { me: undefined, permissionHierarchy: undefined }
  const [ { me, permissionHierarchy }, setData ] = useState<Data>(defaultData)
  const checkAuth = (permission: string, resource: { ownerId: string }, permissions: string[] = undefined): boolean => {
    if (!auth || !me || !permissionHierarchy) {
      return false
    }

    if (resource && resource.ownerId && resource.ownerId === me.id) {
      return true
    }

    permissions = permissions ?? me.permissions

    if (permissions.indexOf(Permission.ALL) !== -1) {
      return true
    }

    if (permissions.indexOf(permission) !== -1) {
      return true
    }

    for (const mePermission of permissions) {
      if (permissionHierarchy.hasOwnProperty(mePermission)) {
        if (checkAuth(permission, resource, permissionHierarchy[mePermission])) {
          return true
        }
      }
    }

    return false
  }

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth))
      apiQuery<{ me: Me, permission: PermissionQuery }>(
        authProviderQuery(),
        data => setData({ me: data.me, permissionHierarchy: data.permission.hierarchy }),
        () => setAuth(undefined),
        () => {
        },
      )
    } else {
      localStorage.removeItem('auth')
      setData(defaultData)
    }
  }, [ auth ])

  const value: AuthProviderContextValue = { auth, setAuth, me, checkAuth }

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  )
}

export default function useAuth(): AuthProviderContextValue {
  return useContext<AuthProviderContextValue>(AuthContext as any)
}