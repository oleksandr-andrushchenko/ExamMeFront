import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Spinner from './Spinner'
import Unauthorized from '../pages/Unauthorized'
import Unauthenticated from '../pages/Unauthenticated'

interface Props {
  permission: any
}

export default function RequireLoggedIn({ permission }: Props) {
  const { auth, me, checkAuth } = useAuth()

  if (!auth) {
    return <Unauthenticated/>
  }

  if (!me) {
    return <Spinner/>
  }

  if (!checkAuth(permission)) {
    return <Unauthorized/>
  }

  return <Outlet/>
}