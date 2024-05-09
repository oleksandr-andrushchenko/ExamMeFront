import React, { createContext, ReactNode, useEffect, useState } from 'react'
import Auth from '../schema/auth/Auth'
import client from '../api/client'
import Me from '../schema/me/Me'
import getMe from '../api/me/getMe'
import Permission from '../enum/Permission'
import getPermissionHierarchy from '../api/auth/getPermissionHierarchy'
import PermissionHierarchy from '../types/PermissionHierarchy'

export const AuthContext = createContext({})

export interface AuthProviderContextValue {
  auth: Auth | undefined
  setAuth: (auth: Auth | undefined) => void
  me: Me | undefined
  checkAuth: (permission: string, resource?: { owner: string }, permissions?: string[]) => boolean
}

interface Data {
  me: Me | undefined
  permissionHierarchy: PermissionHierarchy | undefined
}

export default ({ children }: { children: React.ReactNode }): ReactNode => {
  const cacheAuth = localStorage.getItem('auth')
  const [ auth, setAuth ] = useState<Auth | undefined>(cacheAuth ? JSON.parse(cacheAuth) : undefined)
  const defaultData = { me: undefined, permissionHierarchy: undefined }
  const [ { me, permissionHierarchy }, setData ] = useState<Data>(defaultData)

  const checkAuth = (permission: string, resource: { owner: string }, permissions: string[] = undefined): boolean => {
    if (!auth || !me || !permissionHierarchy) {
      return false
    }

    if (resource && resource.owner === me.id) {
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

  useEffect((): void => {
    if (auth) {
      client.defaults.headers['Authorization'] = `Bearer ${ auth.token }`
      localStorage.setItem('auth', JSON.stringify(auth))
      Promise.all<any>([ getMe(), getPermissionHierarchy() ])
        .then(([ me, permissionHierarchy ]): void => setData({ me, permissionHierarchy }))
        .catch((): void => setAuth(undefined))
    } else {
      delete client.defaults.headers['Authorization']
      localStorage.removeItem('auth')
      setData(defaultData)
    }
  }, [ auth ])

  const value: AuthProviderContextValue = { auth, setAuth, me, checkAuth }

  return <AuthContext.Provider value={ value }>
    { children }
  </AuthContext.Provider>
}