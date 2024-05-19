import { Link, useSearchParams } from 'react-router-dom'
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Option,
  Select,
  Tab,
  Tabs,
  TabsHeader,
  Tooltip,
  Typography,
} from '@material-tailwind/react'
import Category from '../schema/category/Category'
import Route from '../enum/Route'
import useAuth from '../hooks/useAuth'
import { ArrowLeftIcon, ArrowRightIcon, ExclamationCircleIcon, HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import AddCategory from '../components/category/AddCategory'
import AddQuestion from '../components/question/AddQuestion'
import DeleteCategory from '../components/category/DeleteCategory'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Paginated from '../schema/pagination/Paginated'
import Rating from '../components/Rating'
import { apiQuery } from '../api/apolloClient'
import categoriesPageCategoriesQuery from '../api/category/categoriesPageCategoriesQuery'
import CategoryQuery from '../schema/category/CategoryQuery'
import urlSearchParamsToPlainObject from '../utils/urlSearchParamsToPlainObject'

export default function Categories(): ReactNode {
  const [ loading, setLoading ] = useState<boolean>(true)
  const defaultSearchParams = { size: '10' }
  const [ searchParams, setSearchParams ] = useSearchParams(defaultSearchParams)
  const [ categories, setCategories ] = useState<Paginated<Category>>()
  const [ error, setError ] = useState<string>('')
  const { auth, me, checkAuth } = useAuth()

  const refresh = (): void => {
    const filter: CategoryQuery = urlSearchParamsToPlainObject(searchParams)
    apiQuery<{ paginatedCategories: Paginated<Category> }>(
      categoriesPageCategoriesQuery(filter),
      (data): void => setCategories(data.paginatedCategories),
      setError,
      setLoading,
    )
  }
  const applySearchParams = (partialQueryParams: CategoryQuery = {}): void => {
    setCategories(undefined)

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
  const clearSearchParams = (): void => {
    setCategories(undefined)

    setSearchParams(defaultSearchParams)
  }

  const tableFilters = [ 'all', 'free', 'subscription' ]
  const tableColumns = [ '#', 'Title', 'Questions', 'Rating', '' ]
  const showClear = (): boolean => {
    const def = new URLSearchParams(defaultSearchParams)
    def.sort()
    searchParams.sort()

    return def.toString() !== searchParams.toString()
  }

  useEffect(refresh, [ searchParams ])

  useEffect((): void => {
    document.title = 'Categories'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">Categories</Typography>

    <Typography variant="small" className="mt-1">Categories info</Typography>

    { error && <Typography
      variant="small"
      color="red"
      className="flex items-center gap-1 font-normal">
      <ExclamationCircleIcon className="w-1/12"/>
      <span className="w-11/12">{ error }</span>
    </Typography> }

    <div className="flex gap-1 items-center mt-4">
      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_CATEGORY) && <AddCategory/> }
    </div>

    <div className="flex gap-1 items-center mt-4">
      <Tabs value="all" className="min-w-[170px]">
        <TabsHeader>
          { tableFilters.map((value): ReactNode => (
            <Tab key={ value } value={ value } className="text-xs small text-small capitalize"
                 onClick={ (): void => applySearchParams({ price: value === 'all' ? undefined : value }) }>
              { value }
            </Tab>
          )) }
        </TabsHeader>
      </Tabs>

      <Input
        label="Search"
        value={ searchParams.get('search') || '' }
        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => applySearchParams({ search: e.target.value }) }
        icon={ <MagnifyingGlassIcon className="h-4 w-4"/> }/>

      <Select
        label="Size"
        onChange={ (size: string): void => applySearchParams({ size }) }
        value={ searchParams.get('size') || '' }
        className="capitalize">
        { [ 1, 5, 10, 20, 30, 40, 50 ].map((size: number): ReactNode => (
          <Option key={ size }
                  value={ `${ size }` }
                  disabled={ `${ size }` === searchParams.get('size') }>{ size }</Option>
        )) }
      </Select>

      { categories === undefined ? <Spinner/> : ((categories.meta.prevCursor || categories.meta.nextCursor) &&
        <ButtonGroup variant="outlined">
          { categories.meta.prevCursor && (
            <IconButton onClick={ (): void => applySearchParams({ prevCursor: categories?.meta.prevCursor }) }>
              <ArrowLeftIcon className="w-4 h-4"/>
            </IconButton>
          ) }
          { categories.meta.nextCursor && (
            <IconButton onClick={ (): void => applySearchParams({ nextCursor: categories?.meta.nextCursor }) }>
              <ArrowRightIcon className="w-4 h-4"/>
            </IconButton>
          ) }
        </ButtonGroup>) }

      { showClear() && <div>
        <Button variant="outlined" onClick={ clearSearchParams }>Clear</Button>
      </div> }
    </div>

    <table className="w-full table-auto text-left text-xs mt-4">
      <thead>
      <tr>
        { tableColumns.map((head): ReactNode => (
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
      <tbody>
      { categories === undefined && <tr>
        <td colSpan={ tableColumns.length } className="p-5 text-center"><Spinner/></td>
      </tr> }
      { categories && categories.data.length === 0 && <tr>
        <td colSpan={ tableColumns.length } className="p-5 text-center">
          <Typography variant="small">No data</Typography>
        </td>
      </tr> }
      { categories && categories.data && categories.data.map((category: Category, index: number): ReactNode => (
        <tr
          key={ index }
          className={ index === 0 ? 'border-b' : '' }>
          <td className="py-2 px-4">
            <Typography variant="small">
              { index + 1 }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Tooltip content={ category.name }>
              <Typography variant="small" className="capitalize truncate max-w-[500px]">
                <Link
                  key={ category.id }
                  to={ Route.CATEGORY.replace(':categoryId', category.id) }>
                  { category.name }
                </Link>
              </Typography>
            </Tooltip>
          </td>

          <td className="py-2 px-4">
            <Typography variant="small">
              { category.questionCount }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Rating readonly/>
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
        </tr>
      )) }
      </tbody>
    </table>
  </>
}