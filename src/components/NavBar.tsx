import { ArrowRightStartOnRectangleIcon, Bars3Icon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import { Collapse, Navbar, Typography } from '@material-tailwind/react'
import useAuth from '../hooks/useAuth'
import Route from '../enum/Route'
import Spinner from './Spinner'
import Auth from './Auth'
import UserPermission from '../enum/users/UserPermission'
import { FolderPlus as LogoIcon } from 'react-bootstrap-icons'
import Link from './elements/Link'
import Button from './elements/Button'
import IconButton from './elements/IconButton'
import Text from './typography/Text'

const NavBar = () => {
  const [ links, setLinks ] = useState({
    categories: { name: 'Categories', href: Route.Categories },
    questions: { name: 'Questions', href: Route.Questions },
  })
  const [ openNav, setOpenNav ] = useState<boolean>(false)
  const { authenticationToken, me, setAuthenticationToken, checkAuthorization } = useAuth()

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false),
    )
  }, [])

  useEffect(() => {
    if (me && checkAuthorization(UserPermission.Get)) {
      setLinks({ ...links, ...{ users: { name: 'Users', href: Route.Users } } })
    } else {
      delete links['users']
      setLinks(links)
    }
  }, [ authenticationToken, me ])

  const navList = <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-3">
    { Object.values(links).map(({ name, href }) => {
      return <Typography as="li" key={ href } variant="small" color="blue-gray" className="p-1 font-normal">
        <Link label={ name } to={ href } className="flex items-center"/>
      </Typography>
    }) }
    { authenticationToken && !me
      ? <Typography as="li" variant="small"><Spinner type="text"/></Typography>
      : (
        me
          ? <>
            <Typography as="li" variant="small" className="truncate">
              <Text icon={ UserCircleIcon } label={ me.email } variant="small" className="font-normal"/>
            </Typography>
            <Typography as="li" variant="small">
              <Button icon={ ArrowRightStartOnRectangleIcon } label="Logout"
                      onClick={ () => setAuthenticationToken(undefined) }/>
            </Typography>
          </>
          : <>
            <li><Auth/></li>
            <li><Auth register/></li>
          </>
      ) }
  </ul>

  return (
    <Navbar className="h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 text-black" fullWidth={ true }>
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link icon={ LogoIcon } iconSize="10" label="Exam Me" to={ Route.Home }
              className="inline-flex items-center gap-1 font-secondary text-xl"/>
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">{ navList }</div>
          <IconButton
            icon={ openNav ? XMarkIcon : Bars3Icon }
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            onClick={ () => setOpenNav(!openNav) }
          />
        </div>
      </div>
      <Collapse open={ openNav }>
        { navList }
      </Collapse>
    </Navbar>
  )
}

export default memo(NavBar)
