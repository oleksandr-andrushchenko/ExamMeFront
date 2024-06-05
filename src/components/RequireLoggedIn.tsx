import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Spinner from './Spinner'
import Unauthorized from '../pages/Unauthorized'
import Auth from './Auth'

interface Props {
  permission: any
}

export default function RequireLoggedIn({ permission }: Props) {
  const { auth, me, checkAuth } = useAuth()

  return auth && me === undefined ? <Spinner/> : (checkAuth(permission) ? <Outlet/> : (me ? <Unauthorized/> : <Auth/>))
}