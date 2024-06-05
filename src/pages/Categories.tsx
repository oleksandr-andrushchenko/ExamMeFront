import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/solid'
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
import Error from '../components/Error'

export default function Categories(): ReactNode {
  const [ _, setLoading ] = useState<boolean>(true)
  const defaultSearchParams = { size: '20' }
  const [ searchParams, setSearchParams ] = useSearchParams(defaultSearchParams)
  const [ categories, setCategories ] = useState<Paginated<Category>>()
  const [ error, setError ] = useState<string>('')
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const onCategoryCreated = (category: Category) => refresh() && navigate(Route.CATEGORY.replace(':categoryId', category.id!))
  const onCategoryUpdated = () => refresh()
  const onCategoryDeleted = () => refresh()
  const onQuestionCreated = () => refresh()

  const refresh = (): true => {
    const filter: CategoryQuery = urlSearchParamsToPlainObject(searchParams)
    apiQuery<{ paginatedCategories: Paginated<Category> }>(
      categoriesPageCategoriesQuery(filter),
      (data): void => setCategories(data.paginatedCategories),
      setError,
      setLoading,
    )

    return true
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

  useEffect((): void => {
    refresh()
  }, [ searchParams ])

  useEffect((): void => {
    document.title = 'Categories'
  }, [])

  return (
    <>
      <Breadcrumbs>
        <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
        <Link to={ Route.CATEGORIES }>Categories</Link>
      </Breadcrumbs>

      <Typography as="h1" variant="h2" className="mt-1">Categories</Typography>

      <Typography variant="small" className="mt-1">Categories info</Typography>

      { error && <Error text={ error }/> }

      <div className="flex gap-1 items-center mt-4">
        { checkAuth(Permission.CREATE_CATEGORY) && <AddCategory onSubmit={ onCategoryCreated }/> }
      </div>

      <div className="flex gap-1 items-center mt-4">
        <Tabs value="all" className="min-w-[170px]">
          <TabsHeader>
            { tableFilters.map((value) => (
              <Tab
                key={ value }
                value={ value }
                className="text-xs small text-small capitalize"
                onClick={ () => applySearchParams({ price: value === 'all' ? undefined : value }) }>
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
          { [ 1, 5, 10, 20, 30, 40, 50 ].map((size: number) => (
            <Option
              key={ size }
              value={ `${ size }` }
              disabled={ `${ size }` === searchParams.get('size') }>
              { size }
            </Option>
          )) }
        </Select>

        { categories && ((categories.meta.prevCursor || categories.meta.nextCursor) &&
          <ButtonGroup variant="outlined">
            <IconButton onClick={ () => applySearchParams({ prevCursor: categories?.meta.prevCursor }) }
                        disabled={ !categories.meta.prevCursor }>
              <ArrowLeftIcon className="w-4 h-4"/>
            </IconButton>
            <IconButton onClick={ () => applySearchParams({ nextCursor: categories?.meta.nextCursor }) }
                        disabled={ !categories.meta.nextCursor }>
              <ArrowRightIcon className="w-4 h-4"/>
            </IconButton>
          </ButtonGroup>) }

        { showClear() && (
          <div>
            <Button variant="outlined" onClick={ clearSearchParams }>Clear</Button>
          </div>
        ) }
      </div>

      <table className="w-full table-auto text-left text-sm capitalize mt-4">
        <thead>
        <tr>
          { tableColumns.map((head) => (
            <th key={ head }>
              { head }
            </th>
          )) }
        </tr>
        </thead>
        <tbody>
        { categories === undefined && (
          <tr>
            <td colSpan={ tableColumns.length } className="p-5 text-center">
              <Spinner type="text" width="w-full"/>
              <Spinner type="text" width="w-full"/>
              <Spinner type="text" width="w-full"/>
            </td>
          </tr>
        ) }
        { categories && categories.data.length === 0 && (
          <tr>
            <td colSpan={ tableColumns.length } className="p-5 text-center">
              No data
            </td>
          </tr>
        ) }
        { categories && categories.data && categories.data.map((category: Category, index) => (
          <tr key={ category.id }>
            <td>
              { index + 1 }
            </td>

            <td className="truncate max-w-[500px]">
              <Tooltip content={ category.name }>
                <Link
                  key={ category.id }
                  to={ Route.CATEGORY.replace(':categoryId', category.id!) }>
                  { category.name }
                </Link>
              </Tooltip>
            </td>

            <td>
              { category.questionCount }
            </td>

            <td>
              <Rating readonly/>
            </td>

            <td>
              <div className="flex justify-end gap-1">
                { checkAuth(Permission.CREATE_QUESTION) &&
                  <AddQuestion category={ category } onSubmit={ onQuestionCreated } iconButton/> }

                { checkAuth(Permission.UPDATE_CATEGORY, category) &&
                  <AddCategory category={ category } onSubmit={ onCategoryUpdated } iconButton/> }

                { checkAuth(Permission.DELETE_CATEGORY, category) &&
                  <DeleteCategory category={ category } onSubmit={ onCategoryDeleted } iconButton/> }
              </div>
            </td>
          </tr>
        )) }
        </tbody>
      </table>
    </>
  )
}