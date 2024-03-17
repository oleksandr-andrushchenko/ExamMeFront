import { Link } from 'react-router-dom'
import {
  Breadcrumbs,
  Button,
  IconButton,
  Input,
  Tab,
  Tabs,
  TabsHeader,
  Tooltip,
  Typography,
} from '@material-tailwind/react'
import Category from '../schema/Category'
import Route from '../enum/Route'
import useAuth from '../hooks/useAuth'
import { HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import getCategories from '../api/category/getCategories'
import AddCategory from '../components/category/AddCategory'
import AddQuestion from '../components/question/AddQuestion'
import DeleteCategory from '../components/category/DeleteCategory'
import { EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default (): ReactNode => {
  const [ categories, setCategories ] = useState<Category[] | undefined>(undefined)
  const { auth, me, checkAuth } = useAuth()

  const refresh = (): void => {
    getCategories().then((categories): void => setCategories(categories))
  }
  useEffect(refresh, [])

  const tableFilters = [
    {
      label: <Link to={ Route.CATEGORIES }>All</Link>,
      value: 'all',
    },
    {
      label: <Link to={ `${ Route.CATEGORIES }?free=1` }>Free</Link>,
      value: 'free',
    },
    {
      label: <Link to={ `${ Route.CATEGORIES }?premium=1` }>Premium</Link>,
      value: 'premium',
    },
  ]

  const tableColumns = [ '#', 'Title', 'Questions', '' ]

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon
        className="inline-block w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
    </Breadcrumbs>
    <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">Categories</Typography>
    <Typography variant="small" color="gray" className="mt-1 font-normal">
      Available categories
    </Typography>

    <div className="flex flex-col items-center justify-between gap-4 md:flex-row mt-4">
      <Tabs value="all" className="w-full md:w-max">
        <TabsHeader>
          { tableFilters.map(({ label, value }) => <Tab key={ value } value={ value }
                                                        className="text-xs small text-small">{ label }</Tab>) }
        </TabsHeader>
      </Tabs>

      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_CATEGORY) && <AddCategory/> }

      <div className="w-full md:w-72">
        <Input
          label="Search"
          icon={ <MagnifyingGlassIcon className="h-4 w-4"/> }
        />
      </div>
    </div>

    <table className="w-full min-w-max table-auto text-left mt-4">
      <thead>
      <tr>
        { tableColumns.map((head) => (
          <th
            key={ head }
            className="border-y border-blue-gray-100 bg-blue-gray-50/50 py-2 px-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70">
              { head }
            </Typography>
          </th>
        )) }
      </tr>
      </thead>
      { categories === undefined ? <Spinner/> : <tbody>
      { categories.map((category: Category, index: number): ReactNode => {
        const isLast = index === categories.length - 1
        const classes = isLast
          ? 'py-2 px-4'
          : 'py-2 px-4 border-b border-blue-gray-50'

        return <tr key={ index }>
          <td className={ classes }>
            <Typography variant="small">
              { index + 1 }
            </Typography>
          </td>
          <td className={ classes }>
            <Typography variant="small">
              <Link
                key={ category.id }
                to={ Route.CATEGORY.replace(':categoryId', category.id) }>
                { category.name }
              </Link>
            </Typography>
          </td>
          <td className={ classes }>
            <Typography variant="small">
              { category.questionCount }
            </Typography>
          </td>
          <td className={ `${ classes } flex justify-end gap-1` }>
            { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_QUESTION) &&
              <AddQuestion category={ category } onSubmit={ refresh } iconButton/> }

            <Tooltip content="View category">
              <Link
                key={ category.id }
                to={ Route.CATEGORY.replace(':categoryId', category.id) }>
                <IconButton>
                  <EyeIcon className="h-4 w-4"/>
                </IconButton>
              </Link>
            </Tooltip>

            { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_CATEGORY) &&
              <AddCategory category={ category } onSubmit={ refresh } iconButton/> }

            { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_CATEGORY) &&
              <DeleteCategory category={ category } onSubmit={ refresh } iconButton/> }
          </td>
        </tr>
      }) }
      </tbody> }
    </table>

    <div className="flex gap-1 mt-4">
      <Button variant="outlined">Previous</Button>
      <div className="flex items-center gap-2">
        <IconButton variant="outlined">1</IconButton>
        <IconButton variant="text">2</IconButton>
        <IconButton variant="text">3</IconButton>
        <IconButton variant="text">...</IconButton>
        <IconButton variant="text">8</IconButton>
        <IconButton variant="text">9</IconButton>
        <IconButton variant="text">10</IconButton>
      </div>
      <Button variant="outlined">Next</Button>
    </div>
  </>
}