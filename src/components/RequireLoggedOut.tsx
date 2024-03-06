import { Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Route from '../enum/Route'
import { ReactNode } from 'react'

export default (): ReactNode => {
  const { auth } = useAuth()
  const navigate = useNavigate()

  if (auth) {
    navigate(Route.HOME)
  }

  return <Outlet/>
}