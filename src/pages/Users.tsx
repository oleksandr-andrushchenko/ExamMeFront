import { Link, useSearchParams } from 'react-router-dom'
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Option,
  Select,
  Tooltip,
  Typography,
} from '@material-tailwind/react'
import Route from '../enum/Route'
import useAuth from '../hooks/useAuth'
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import Spinner from '../components/Spinner'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Paginated from '../schema/pagination/Paginated'
import { apiQuery } from '../api/apolloClient'
import urlSearchParamsToPlainObject from '../utils/urlSearchParamsToPlainObject'
import Error from '../components/Error'
import User from '../schema/users/User'
import GetUsers from '../schema/users/GetUsers'
import getUsersForUsersPage from '../api/users/getUsersForUsersPage'
import UserPermission from '../enum/users/UserPermission'
import AddUser from '../components/users/AddUser'
import { ListIcon } from '../registry/icons'
import H1 from '../components/typography/H1'

const Users = () => {
  const [ _, setLoading ] = useState<boolean>(true)
  const defaultSearchParams = { size: '20' }
  const [ searchParams, setSearchParams ] = useSearchParams(defaultSearchParams)
  const [ users, setUsers ] = useState<Paginated<User>>()
  const [ error, setError ] = useState<string>('')
  const { checkAuthorization } = useAuth()

  const onUserUpdated = () => refresh()

  const refresh = (): true => {
    const filter: GetUsers = urlSearchParamsToPlainObject(searchParams)
    apiQuery<{ paginatedUsers: Paginated<User> }>(
      getUsersForUsersPage(filter),
      (data) => setUsers(data.paginatedUsers),
      setError,
      setLoading,
    )

    return true
  }
  const applySearchParams = (partialQueryParams: GetUsers = {}) => {
    setUsers(undefined)

    searchParams.delete('prevCursor')
    searchParams.delete('nextCursor')

    for (const key in partialQueryParams) {
      if (partialQueryParams[key] === undefined || partialQueryParams[key] === '') {
        searchParams.delete(key)
      } else {
        searchParams.set(key, partialQueryParams[key])
      }
    }

    searchParams.sort()

    setSearchParams(searchParams)
  }
  const clearSearchParams = () => {
    setUsers(undefined)

    setSearchParams(defaultSearchParams)
  }

  const tableColumns = [ '#', 'ID', 'Name', 'Email', 'Permissions', '' ]
  const showClear = (): boolean => {
    const def = new URLSearchParams(defaultSearchParams)
    def.sort()
    searchParams.sort()

    return def.toString() !== searchParams.toString()
  }

  useEffect(() => {
    refresh()
  }, [ searchParams ])

  useEffect(() => {
    document.title = 'Users'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.Users }>Users</Link>
    </Breadcrumbs>

    <H1 icon={ ListIcon }>Users</H1>

    <Typography variant="small" className="mt-1">Users info</Typography>

    { error && <Error text={ error }/> }

    <div className="flex gap-1 items-center mt-4">
      <Input
        label="Search"
        value={ searchParams.get('search') || '' }
        onChange={ (e) => applySearchParams({ search: e.target.value }) }
        icon={ <MagnifyingGlassIcon className="h-4 w-4"/> }
      />

      <Select
        label="Size"
        onChange={ (size: string) => applySearchParams({ size }) }
        value={ searchParams.get('size') || '' }
        className="capitalize"
      >
        { [ 1, 5, 10, 20, 30, 40, 50 ].map((size: number) => (
          <Option
            key={ size }
            value={ `${ size }` }
            disabled={ `${ size }` === searchParams.get('size') }
          >
            { size }
          </Option>
        )) }
      </Select>

      { users && ((users.meta.prevCursor || users.meta.nextCursor) &&
        <ButtonGroup variant="outlined">
          <IconButton onClick={ () => applySearchParams({ prevCursor: users?.meta.prevCursor }) }
                      disabled={ !users.meta.prevCursor }>
            <ArrowLeftIcon className="w-4 h-4"/>
          </IconButton>
          <IconButton onClick={ () => applySearchParams({ nextCursor: users?.meta.nextCursor }) }
                      disabled={ !users.meta.nextCursor }>
            <ArrowRightIcon className="w-4 h-4"/>
          </IconButton>
        </ButtonGroup>) }

      { showClear() && (
        <div>
          <Button variant="outlined" onClick={ clearSearchParams }>Clear</Button>
        </div>
      ) }
    </div>

    <table className="w-full table-auto text-left text-sm mt-4">
      <thead>
      <tr>
        { tableColumns.map((head) => (
          <th key={ head }>{ head }</th>
        )) }
      </tr>
      </thead>
      <tbody>
      { !users && <tr>
        <td colSpan={ tableColumns.length } className="p-5 text-center">
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
        </td>
      </tr> }
      { users && users.data.length === 0 && <tr>
        <td colSpan={ tableColumns.length } className="p-5 text-center">No data</td>
      </tr> }
      { users && users.data && users.data.map((user: User, index) => (
        <tr key={ user.id }>
          <td>{ index + 1 }</td>
          <td>{ user.id }</td>

          <td className="truncate max-w-[500px]">
            <Tooltip content={ user.name }>
              <Link key={ user.id } to={ Route.Users.replace(':userId', user.id!) }>
                { user.name }
              </Link>
            </Tooltip>
          </td>

          <td>{ user.email }</td>
          <td>{ user.permissions?.join(', ') }</td>

          <td className="flex justify-end gap-1">
            { checkAuthorization(UserPermission.Update, user) &&
              <AddUser user={ user } onSubmit={ onUserUpdated } iconButton/> }
          </td>
        </tr>
      )) }
      </tbody>
    </table>
  </>
}

export default memo(Users)