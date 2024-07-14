import { Link } from 'react-router-dom'
import { Breadcrumbs, Chip, Tooltip, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import useAuth from '../hooks/useAuth'
import { HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import Paginated from '../schema/pagination/Paginated'
import User from '../schema/users/User'
import getUsersForUsersPage from '../api/users/getUsersForUsersPage'
import UserPermission from '../enum/users/UserPermission'
import AddUser from '../components/users/AddUser'
import { ListIcon } from '../registry/icons'
import H1 from '../components/typography/H1'
import DeleteUser from '../components/users/DeleteUser'
import Permission from '../enum/Permission'
import Rating from '../components/Rating'
import Table from '../components/elements/Table'

const Users = () => {
  const [ tableKey, setTableKey ] = useState<number>(2)
  const refresh = () => setTableKey(Math.random())
  const { checkAuthorization } = useAuth()

  useEffect(() => {
    document.title = 'Users'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.Home } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.Users }>Users</Link>
    </Breadcrumbs>

    <H1 icon={ ListIcon }>Users</H1>

    <Typography variant="small" className="mt-1">Users info</Typography>

    <Table
      key2={ tableKey }
      buttons={ {
        create: checkAuthorization(UserPermission.Create) && <AddUser onSubmit={ refresh }/>,
      } }
      columns={ [ '#', 'Name', 'Email', 'Permissions', 'Rating', '' ] }
      queryOptions={ (filter) => getUsersForUsersPage(filter) }
      queryData={ (data: { paginatedUsers: Paginated<User> }) => data.paginatedUsers }
      mapper={ (user: User, index: number) => [
        user.id,
        index + 1,
        <Tooltip content={ user.name }>
          <Link key={ user.id } to={ Route.Users.replace(':userId', user.id!) }>
            { user.name }
          </Link>
        </Tooltip>,
        user.email,
        user.permissions?.map(permission => (
          <Chip
            value={ permission }
            color={ [ Permission.All, Permission.Root ].includes(permission as any) ? 'green' : 'blue' }
            className="mr-1 mb-1"
          />
        )),
        <Rating readonly/>,
        <span className="flex justify-end gap-1">
          { checkAuthorization(UserPermission.Update, user) &&
            <AddUser user={ user } onSubmit={ refresh } iconButton/> }

          { checkAuthorization(UserPermission.Delete, user) &&
            <DeleteUser user={ user } onSubmit={ refresh } iconButton/> }
        </span>,
      ] }
    />
  </>
}

export default memo(Users)