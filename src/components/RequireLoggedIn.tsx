import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Spinner from './Spinner'
import Unauthorized from '../pages/Unauthorized'
import { ReactNode } from 'react'
import Auth from './Auth.tsx'

interface Props {
  permission: any
}

export default ({ permission }: Props): ReactNode => {
  const { auth, me, checkAuth } = useAuth()

  return auth && me === undefined ? <Spinner/> : (checkAuth(permission) ? <Outlet/> : (me ? <Unauthorized/> : <Auth/>))
}