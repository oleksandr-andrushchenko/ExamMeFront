import { Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Spinner from './Spinner'
import Unauthorized from '../pages/Unauthorized'
import Unauthenticated from '../pages/Unauthenticated'
import { ComponentProps } from 'react'

interface Props extends ComponentProps<any> {
  permission?: any
}

export default function RequireAuthentication({ permission }: Props) {
  const { authenticationToken, me, checkAuthorization } = useAuth()

  if (!authenticationToken) {
    return <Unauthenticated/>
  }

  if (!me) {
    return <Spinner/>
  }

  if (permission && !checkAuthorization(permission)) {
    return <Unauthorized/>
  }

  return <Outlet/>
}