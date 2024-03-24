import { Link } from 'react-router-dom'
import { Breadcrumbs, Button, Input, Tab, Tabs, TabsHeader, Typography } from '@material-tailwind/react'
import Category from '../schema/Category'
import Route from '../enum/Route'
import useAuth from '../hooks/useAuth'
import { HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import queryCategories from '../api/category/queryCategories'
import AddCategory from '../components/category/AddCategory'
import AddQuestion from '../components/question/AddQuestion'
import DeleteCategory from '../components/category/DeleteCategory'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Paginated from '../types/pagination/Paginated'
import Pagination from '../types/pagination/Pagination'

export default (): ReactNode => {
  const [ categories, setCategories ] = useState<Paginated<Category>>()
  const [ pagination, setPagination ] = useState<Pagination>({ size: 20 })
  const { auth, me, checkAuth } = useAuth()

  const refresh = (): void => {
    queryCategories(pagination).then((categories): void => setCategories(categories))
  }
  const onPrevClick = (): void => {
    setCategories(undefined)
    setPagination({
      ...pagination, ...{
        prevCursor: categories.meta.prevCursor,
        nextCursor: undefined,
      },
    })
  }
  const onNextClick = (): void => {
    setCategories(undefined)
    setPagination({
      ...pagination, ...{
        prevCursor: undefined,
        nextCursor: categories.meta.nextCursor,
      },
    })
  }

  useEffect(refresh, [ pagination ])

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

    <Typography variant="h1" className="flex items-baseline mt-1">Categories</Typography>

    <Typography variant="small" className="mt-1">
      Available categories
    </Typography>

    <div className="flex gap-1 items-center mt-4">
      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_CATEGORY) && <AddCategory/> }
    </div>

    <div className="flex gap-1 items-center mt-4">
      <Tabs value="all" className="w-full md:w-max">
        <TabsHeader>
          { tableFilters.map(({ label, value }) => <Tab key={ value } value={ value }
                                                        className="text-xs small text-small">{ label }</Tab>) }
        </TabsHeader>
      </Tabs>

      <div>
        <Input
          label="Search"
          icon={ <MagnifyingGlassIcon className="h-4 w-4"/> }
        />
      </div>
    </div>

    <table className="w-full table-auto text-left text-xs mt-4">
      <thead>
      <tr>
        { tableColumns.map((head) => (
          <th
            key={ head }
            className="bg-blue-gray-50/50 py-2 px-4">
            <Typography
              variant="small"
              className="opacity-70">
              { head }
            </Typography>
          </th>
        )) }
      </tr>
      </thead>
      { categories === undefined ? <Spinner/> : <tbody>
      { categories.data
        ? categories.data.map((category: Category, index: number): ReactNode => <tr
          key={ index }
          className={ index === 0 ? 'border-b' : '' }>
          <td className="py-2 px-4">
            <Typography variant="small">
              { index + 1 }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Typography variant="small">
              <Link
                key={ category.id }
                to={ Route.CATEGORY.replace(':categoryId', category.id) }>
                { category.name }
              </Link>
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Typography variant="small">
              { category.questionCount }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <div className="flex justify-end gap-1">
              { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_QUESTION) &&
                <AddQuestion category={ category } onSubmit={ refresh } iconButton/> }

              { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_CATEGORY) &&
                <AddCategory category={ category } onSubmit={ refresh } iconButton/> }

              { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_CATEGORY) &&
                <DeleteCategory category={ category } onSubmit={ refresh } iconButton/> }
            </div>
          </td>
        </tr>)
        : <tr>
          <td colSpan={ tableColumns.length } className="p-5 text-center">No data</td>
        </tr> }
      </tbody> }
    </table>

    { categories === undefined ? <Spinner/> : ((categories.meta.prevCursor || categories.meta.nextCursor) &&
      <div className="flex gap-1 mt-4">
        { categories.meta.prevCursor && <Button variant="outlined" onClick={ onPrevClick }>Previous</Button> }
        { categories.meta.nextCursor && <Button variant="outlined" onClick={ onNextClick }>Next</Button> }
      </div>) }
  </>
}