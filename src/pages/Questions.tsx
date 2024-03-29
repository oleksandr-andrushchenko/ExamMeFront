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
import Route from '../enum/Route'
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import Question from '../schema/Question'
import AddQuestion from '../components/question/AddQuestion'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { QuestionDifficulty, QuestionType } from '../schema/QuestionTransfer'
import Paginated from '../types/pagination/Paginated'
import Pagination from '../types/pagination/Pagination'
import queryQuestions from '../api/question/queryQuestions'
import Category from '../schema/Category'
import queryCategories from '../api/category/queryCategories'

interface QueryParams extends Pagination {
  category?: string
  price?: string
  search?: string
  difficulty?: string
  type?: string
}

export default (): ReactNode => {
  const defaultSearchParams = { size: '10' }
  const [ searchParams, setSearchParams ] = useSearchParams(defaultSearchParams)
  const [ categories, setCategories ] = useState<Paginated<Category>>()
  const [ questions, setQuestions ] = useState<Paginated<Question>>()
  const { auth, me, checkAuth } = useAuth()

  useEffect((): void => {
    queryCategories().then((categories: Paginated<Category>): void => setCategories(categories))
  }, [])

  const refresh = (): void => {
    queryQuestions(searchParams).then((questions): void => setQuestions(questions))
  }
  const applySearchParams = (partialQueryParams: QueryParams = {}): void => {
    setQuestions(undefined)

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
    setQuestions(undefined)

    setSearchParams(defaultSearchParams)
  }

  useEffect(refresh, [ searchParams ])

  const tableFilters = [ 'all', 'free', 'subscription' ]
  const tableColumns = [ '#', 'Title', 'Category', 'Difficulty', 'Type', '' ]
  const showClear = (): boolean => {
    const def = new URLSearchParams(defaultSearchParams)
    def.sort()
    searchParams.sort()

    return def.toString() !== searchParams.toString()
  }
  const getCategory = (id: string): Category => (categories?.data || []).filter((category: Category): boolean => category.id === id)[0]

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Questions</Link>
    </Breadcrumbs>

    <Typography variant="h1" className="mt-1">Questions</Typography>

    <Typography variant="small" className="mt-1">Questions info</Typography>

    <div className="flex gap-1 items-center mt-4">
      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_QUESTION) && <AddQuestion/> }
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

      { categories === undefined ? <Spinner/> : (
        <Select
          label="Category"
          onChange={ (category: string): void => applySearchParams({ category }) }
          value={ searchParams.get('category') || '' }
          className="capitalize">
          { categories.data.map((category: Category): ReactNode => (
            <Option key={ category.id }
                    value={ category.id }
                    disabled={ category.id === searchParams.get('category') }
                    className="capitalize truncate max-w-[170px]">{ category.name }</Option>
          )) }
        </Select>
      ) }

      <Select
        label="Difficulty"
        onChange={ (difficulty: string): void => applySearchParams({ difficulty }) }
        value={ searchParams.get('difficulty') || '' }
        className="capitalize">
        { Object.values(QuestionDifficulty)
          .map((difficulty: string): ReactNode => (
            <Option key={ difficulty }
                    value={ difficulty }
                    disabled={ difficulty === searchParams.get('difficulty') }
                    className="capitalize">{ difficulty }</Option>
          )) }
      </Select>

      <Select
        label="Type"
        onChange={ (type: string): void => applySearchParams({ type }) }
        value={ searchParams.get('type') || '' }
        className="capitalize">
        { Object.values(QuestionType)
          .map((type: string): ReactNode => (
            <Option key={ type }
                    value={ type }
                    disabled={ type === searchParams.get('type') }
                    className="capitalize">{ type }</Option>
          )) }
      </Select>

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

      { questions === undefined ? <Spinner/> : ((questions.meta.prevCursor || questions.meta.nextCursor) &&
        <ButtonGroup variant="outlined">
          { questions.meta.prevCursor && (
            <IconButton onClick={ (): void => applySearchParams({ prevCursor: questions?.meta.prevCursor }) }>
              <ArrowLeftIcon className="w-4 h-4"/>
            </IconButton>
          ) }
          { questions.meta.nextCursor && (
            <IconButton onClick={ (): void => applySearchParams({ nextCursor: questions?.meta.nextCursor }) }>
              <ArrowRightIcon className="w-4 h-4"/>
            </IconButton>
          ) }
        </ButtonGroup>) }

      { showClear() && <div>
        <Button variant="outlined" onClick={ clearSearchParams }>Clear</Button>
      </div> }
    </div>

    <table className="w-full table-auto text-left mt-4">
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
      <tbody>
      { questions === undefined && <tr key={ 0 }>
        <td colSpan={ tableColumns.length } className="p-5 text-center"><Spinner/></td>
      </tr> }
      { questions && questions.data.length === 0 && <tr key={ 0 }>
        <td colSpan={ tableColumns.length } className="p-5 text-center">
          <Typography variant="small">No data</Typography>
        </td>
      </tr> }
      { questions && questions.data && questions.data.map((question: Question, index: number): ReactNode => (
        <tr key={ index } className={ index === 0 ? 'border-b' : '' }>
          <td className="py-2 px-4">
            <Typography variant="small">
              { index + 1 }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Tooltip content={question.title}>
              <Typography variant="small" className="capitalize truncate max-w-[350px]">
                <Link
                  key={ question.id }
                  to={ Route.QUESTION.replace(':categoryId', question.category).replace(':questionId', question.id) }>
                  { question.title }
                </Link>
              </Typography>
            </Tooltip>
          </td>

          <td className="py-2 px-4">
            { categories === undefined ? <Spinner/> : (
              <Tooltip content={ getCategory(question.category).name }>
                <Typography variant="small" className="capitalize truncate max-w-[100px]">
                  { getCategory(question.category).name }
                </Typography>
              </Tooltip>
            ) }
          </td>

          <td className="py-2 px-4">
            <Typography variant="small" className="capitalize">
              { question.difficulty }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Typography variant="small" className="capitalize">
              { question.type }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <div className="flex justify-end gap-1">
              { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_QUESTION) &&
                <AddQuestion question={ question } onSubmit={ refresh } iconButton/> }

              { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_QUESTION) &&
                <DeleteQuestion question={ question } onSubmit={ refresh } iconButton/> }
            </div>
          </td>
        </tr>
      )) }
      </tbody>
    </table>
  </>
}