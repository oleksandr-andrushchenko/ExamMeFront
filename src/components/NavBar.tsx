import { ArrowRightStartOnRectangleIcon, Bars3Icon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import classNames from '../utils/classNames'
import { ReactNode, useEffect, useState } from 'react'
import { Button, Collapse, IconButton, Navbar, Typography } from '@material-tailwind/react'
import useAuth from '../hooks/useAuth'
import Route from '../enum/Route'
import Spinner from './Spinner'
import Auth from './Auth'

export default (): ReactNode => {

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Categories', href: '/categories' },
  ]

  const [ openNav, setOpenNav ] = useState<boolean>(false)
  const { auth, me, setAuth } = useAuth()

  useEffect((): void => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false),
    )
  }, [])

  const navList = <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
    { navigation.map((item) => {
      const resolvedPath = useResolvedPath(item.href)
      const current = useMatch({ path: resolvedPath.pathname, end: true })

      return <Typography
        as="li"
        key={ item.href }
        variant="small"
        color="blue-gray"
        className="p-1 font-normal">
        <Link
          key={ item.name }
          to={ item.href }
          className={ classNames(
            current ? 'underline' : '',
            'flex items-center',
          ) }
          aria-current={ current ? 'page' : undefined }>
          { item.name }
        </Link>
      </Typography>
    }) }
    {
      auth && me === undefined
        ? <Typography
          as="li"
          variant="small"
          className="p-1 font-normal">
          <Spinner/>
        </Typography>
        : (
          me
            ? <>
              <Typography
                as="li"
                variant="small"
                className="p-1 font-normal truncate">
                <UserCircleIcon className="inline-block h-4 w-4 mr-1"/>
                { me.email }
              </Typography>
              <Typography
                as="li"
                variant="small"
                className="p-1 font-normal">
                <Button
                  size="sm"
                  onClick={ () => setAuth(undefined) }>
                  <ArrowRightStartOnRectangleIcon className="inline-block h-4 w-4"/> Logout
                </Button>
              </Typography>
            </>
            : <>
              <Typography
                as="li"
                variant="small"
                className="p-1 font-normal">
                <Auth/>
              </Typography>
              <Typography
                as="li"
                variant="small"
                className="p-1 font-normal">
                <Auth register/>
              </Typography>
            </>
        )
    }
  </ul>

  return (
    <Navbar className="h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4" fullWidth={ true }>
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link
          to={ Route.HOME }
          className="inline-flex items-center w-2/12">
          <CheckCircleIcon className="h-12 w-12"/> Exam Me
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">{ navList }</div>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={ false }
            onClick={ () => setOpenNav(!openNav) }>
            { openNav
              ? <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
              : <Bars3Icon className="block h-6 w-6" aria-hidden="true"/> }
          </IconButton>
        </div>
      </div>
      <Collapse open={ openNav }>
        { navList }
      </Collapse>
    </Navbar>
  )
}
