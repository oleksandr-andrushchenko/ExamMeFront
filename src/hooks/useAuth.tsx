import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import Token from '../schema/auth/Token'
import Me from '../schema/me/Me'
import Permission from '../enum/Permission'
import { default as PermissionQuery } from '../schema/auth/Permission'
import { apiQuery } from '../api/apolloClient'
import getMeAndPermissions from '../api/me/getMeAndPermissions'
import PermissionHierarchy from '../schema/auth/PermissionHierarchy'

const authenticationContext = createContext({})

interface AuthenticationProviderContextValue {
  authenticationToken: Token | undefined
  setAuthenticationToken: (token: Token | undefined) => void
  me: Me | undefined
  checkAuthorization: (permission: string, resource?: { ownerId?: string }, permissions?: string[]) => boolean
}

interface Data {
  me?: Me | undefined
  permissionHierarchy?: PermissionHierarchy | undefined
}

export function AuthenticationProvider({ children }: { children: ReactNode }) {
  const authenticationTokenString = localStorage.getItem('authenticationToken')
  const [ authenticationToken, setAuthenticationToken ] = useState<Token | undefined>(
    authenticationTokenString ? JSON.parse(authenticationTokenString) : undefined,
  )
  const defaultData = { me: undefined, permissionHierarchy: undefined }
  const [ { me, permissionHierarchy }, setData ] = useState<Data>(defaultData)
  const checkAuthorization = (permission: string, resource: {
    ownerId: string
  }, permissions: string[] = undefined): boolean => {
    if (!authenticationToken || !me || !permissionHierarchy) {
      return false
    }

    if (resource && resource.ownerId && resource.ownerId === me.id) {
      return true
    }

    permissions = permissions ?? me.permissions

    if (permissions.indexOf(Permission.All) !== -1) {
      return true
    }

    if (permissions.indexOf(permission) !== -1) {
      return true
    }

    for (const mePermission of permissions) {
      if (permissionHierarchy.hasOwnProperty(mePermission)) {
        if (checkAuthorization(permission, resource, permissionHierarchy[mePermission])) {
          return true
        }
      }
    }

    return false
  }

  useEffect(() => {
    if (authenticationToken) {
      localStorage.setItem('authenticationToken', JSON.stringify(authenticationToken))
      apiQuery<{ me: Me, permission: PermissionQuery }>(
        getMeAndPermissions(),
        data => setData({ me: data.me, permissionHierarchy: data.permission.hierarchy }),
        () => setAuthenticationToken(undefined),
        () => {
        },
      )
    } else {
      localStorage.removeItem('authenticationToken')
      setData(defaultData)
    }
  }, [ authenticationToken ])

  const value: AuthenticationProviderContextValue = {
    authenticationToken,
    setAuthenticationToken,
    me,
    checkAuthorization,
  }

  return (
    <authenticationContext.Provider value={ value }>
      { children }
    </authenticationContext.Provider>
  )
}

export default function useAuth(): AuthenticationProviderContextValue {
  return useContext<AuthenticationProviderContextValue>(authenticationContext as any)
}