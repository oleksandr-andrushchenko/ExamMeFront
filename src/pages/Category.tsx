import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
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
import { ArrowLeftIcon, ArrowRightIcon, ExclamationCircleIcon, HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import Category from '../schema/category/Category'
import Question from '../schema/question/Question'
import DeleteCategory from '../components/category/DeleteCategory'
import AddQuestion from '../components/question/AddQuestion'
import AddCategory from '../components/category/AddCategory'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { QuestionDifficulty, QuestionType } from '../schema/question/QuestionTransfer'
import Paginated from '../schema/pagination/Paginated'
import AddExam from '../components/exam/AddExam'
import Rating from '../components/Rating'
import QuestionQuery from '../schema/question/QuestionQuery'
import { apiQuery } from '../api/apolloClient'
import categoryPageQuestionsQuery from '../api/category/categoryPageQuestionsQuery'
import urlSearchParamsToPlainObject from '../utils/urlSearchParamsToPlainObject'
import categoryPageQuestionsAndCategoryQuery from '../api/category/categoryPageQuestionsAndCategoryQuery'

export default function Category(): ReactNode {
  const defaultSearchParams = { size: '10' }
  const [ queryWithCategory, setQueryWithCategory ] = useState<boolean>(true)
  const { categoryId }: { categoryId: string } = useParams()
  const [ searchParams, setSearchParams ] = useSearchParams(defaultSearchParams)
  const [ category, setCategory ] = useState<Category>()
  const [ questions, setQuestions ] = useState<Paginated<Question>>()
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { auth, me, checkAuth } = useAuth()
  const navigate = useNavigate()

  const onCategoryUpdated = (category: Category) => setCategory(category)
  const onCategoryDeleted = () => navigate(Route.CATEGORIES, { replace: true })
  const onQuestionCreated = () => refresh()
  const onQuestionUpdated = () => refresh()
  const onQuestionDeleted = () => refresh()

  const refresh = (): true => {
    setLoading(true)
    const filter: QuestionQuery = urlSearchParamsToPlainObject(searchParams)

    if (queryWithCategory) {
      setQueryWithCategory(false)

      apiQuery<{ paginatedQuestions: Paginated<Question>, category: Category }>(
        categoryPageQuestionsAndCategoryQuery(categoryId, filter),
        (data): void => {
          setCategory(data.category)
          setQuestions(data.paginatedQuestions)
        },
        setError,
        setLoading,
      )
    } else {
      apiQuery<{ paginatedQuestions: Paginated<Question> }>(
        categoryPageQuestionsQuery(categoryId, filter),
        (data): void => setQuestions(data.paginatedQuestions),
        setError,
        setLoading,
      )
    }

    return true
  }
  const applySearchParams = (partialQueryParams: QuestionQuery = {}): void => {
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

  const tableFilters = [ 'all', 'free', 'subscription' ]
  const tableColumns = [ '#', 'Title', 'Difficulty', 'Type', 'Rating', '' ]
  const showClear = (): boolean => {
    const def = new URLSearchParams(defaultSearchParams)
    def.sort()
    searchParams.sort()

    return def.toString() !== searchParams.toString()
  }

  useEffect((): void => {
    refresh()
  }, [ auth, searchParams ])

  useEffect((): void => {
    document.title = category?.name || 'ExamMe'
  }, [ category ])

  return (
    <>
      <Breadcrumbs>
        <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
        <Link to={ Route.CATEGORIES }>Categories</Link>
        { category === undefined ? <Spinner type="text"/> :
          <Link to={ Route.CATEGORY.replace(':categoryId', category.id!) }>{ category.name }</Link> }
      </Breadcrumbs>

      <Typography as="h1" variant="h2" className="mt-1">{ category === undefined ?
        <Spinner type="text"/> : category.name }</Typography>

      <Rating/>

      <Typography variant="small" className="mt-1">Category info</Typography>

      { error && <Typography
        variant="small"
        color="red"
        className="flex items-center gap-1 font-normal">
        <ExclamationCircleIcon className="w-1/12"/>
        <span className="w-11/12">{ error }</span>
      </Typography> }

      <div className="flex gap-1 items-center mt-4">
        { auth && me === undefined ?
          <Spinner type="button"/> : checkAuth(Permission.CREATE_QUESTION, category) && (category === undefined ?
          <Spinner type="button"/> : <AddQuestion category={ category } onSubmit={ onQuestionCreated }/>) }

        { auth && me === undefined ? <Spinner type="button"/> : checkAuth(Permission.UPDATE_CATEGORY, category) &&
          (category === undefined ? <Spinner type="button"/> :
            <AddCategory category={ category } onSubmit={ onCategoryUpdated }/>) }

        { auth && me === undefined ? <Spinner type="button"/> : checkAuth(Permission.DELETE_CATEGORY, category) &&
          (category === undefined ? <Spinner type="button"/> :
            <DeleteCategory category={ category } onSubmit={ onCategoryDeleted }/>) }

        { category === undefined ? <Spinner type="button"/> : (category.questionCount > 0) &&
          <AddExam category={ category }/> }
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
          <tr key={ question.id } className={ index === 0 ? 'border-b' : '' }>
            <td className="py-2 px-4">
              <Typography variant="small">
                { index + 1 }
              </Typography>
            </td>

            <td className="py-2 px-4">
              <Tooltip content={ question.title }>
                <Typography variant="small" className="capitalize truncate max-w-[400px]">
                  <Link
                    key={ question.id }
                    to={ Route.QUESTION.replace(':categoryId', question.categoryId!).replace(':questionId', question.id!) }>
                    { question.title }
                  </Link>
                </Typography>
              </Tooltip>
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
              <Rating readonly/>
            </td>

            <td className="py-2 px-4">
              <div className="flex justify-end gap-1">
                { auth && me === undefined ? <Spinner type="button"/> : checkAuth(Permission.UPDATE_QUESTION, question) &&
                  <AddQuestion question={ question } onSubmit={ onQuestionUpdated } iconButton/> }

                { auth && me === undefined ? <Spinner type="button"/> : checkAuth(Permission.DELETE_QUESTION, question) &&
                  <DeleteQuestion question={ question } onSubmit={ onQuestionDeleted } iconButton/> }
              </div>
            </td>
          </tr>
        )) }
        </tbody>
      </table>
    </>
  )
}