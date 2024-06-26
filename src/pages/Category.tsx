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
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
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
import Error from '../components/Error'
import ExamPermission from '../enum/exam/ExamPermission'
import CategoryPermission from '../enum/category/CategoryPermission'
import QuestionPermission from '../enum/question/QuestionPermission'

const Category = () => {
  const defaultSearchParams = { size: '20' }
  const [ queryWithCategory, setQueryWithCategory ] = useState<boolean>(true)
  const { categoryId }: { categoryId: string } = useParams()
  const [ searchParams, setSearchParams ] = useSearchParams(defaultSearchParams)
  const [ category, setCategory ] = useState<Category>()
  const [ questions, setQuestions ] = useState<Paginated<Question>>()
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { auth, checkAuth } = useAuth()
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
        data => {
          setCategory(data.category)
          setQuestions(data.paginatedQuestions)
        },
        setError,
        setLoading,
      )
    } else {
      apiQuery<{ paginatedQuestions: Paginated<Question> }>(
        categoryPageQuestionsQuery(categoryId, filter),
        data => setQuestions(data.paginatedQuestions),
        setError,
        setLoading,
      )
    }

    return true
  }
  const applySearchParams = (partialQueryParams: QuestionQuery = {}) => {
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
  const clearSearchParams = () => {
    setQuestions(undefined)

    setSearchParams(defaultSearchParams)
  }

  const tableFilters: string[] = [ 'all', 'free', 'subscription' ]
  const tableColumns: string[] = [ '#', 'Title', 'Difficulty', 'Type', 'Rating', '' ]
  const showClear = (): boolean => {
    const def = new URLSearchParams(defaultSearchParams)
    def.sort()
    searchParams.sort()

    return def.toString() !== searchParams.toString()
  }

  useEffect(() => {
    refresh()
  }, [ auth, searchParams ])

  useEffect(() => {
    document.title = category?.name || 'ExamMe'
  }, [ category ])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { !category ? <Spinner type="text"/> :
        <Link to={ Route.CATEGORY.replace(':categoryId', category.id!) }>{ category.name }</Link> }
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">{ !category ?
      <Spinner type="text"/> : category.name }</Typography>

    <Rating/>

    { error && <Error text={ error }/> }

    <Typography variant="small" className="mt-4">Category info</Typography>

    <table className="w-full table-auto text-left text-sm">
      <tbody>
      <tr>
        <th className="w-2/12">Name</th>
        <td>{ category ? category.name : <Spinner type="text"/> }</td>
      </tr>
      <tr>
        <th>Required score</th>
        <td>{ category ? (category.requiredScore ?? 0) : <Spinner type="text"/> }</td>
      </tr>
      </tbody>
    </table>

    <div className="flex gap-1 items-center mt-4">
      { checkAuth(QuestionPermission.CREATE, category) && (!category ?
        <Spinner type="button"/> : <AddQuestion category={ category } onSubmit={ onQuestionCreated }/>) }

      { checkAuth(CategoryPermission.UPDATE, category) && (!category ? <Spinner type="button"/> :
        <AddCategory category={ category } onSubmit={ onCategoryUpdated }/>) }

      { checkAuth(CategoryPermission.DELETE, category) && (!category ? <Spinner type="button"/> :
        <DeleteCategory category={ category } onSubmit={ onCategoryDeleted }/>) }

      { !category ? <Spinner type="button"/> : !!category.questionCount && checkAuth(ExamPermission.CREATE) &&
        <AddExam category={ category }/> }
    </div>

    <Typography variant="small" className="mt-4">Category questions</Typography>

    <div className="flex gap-1 items-center">
      <Tabs value="all" className="min-w-[170px]">
        <TabsHeader>
          { tableFilters.map((value) => (
            <Tab
              key={ value }
              value={ value }
              className="text-xs small text-small"
              onClick={ () => applySearchParams({ price: value === 'all' ? undefined : value }) }>
              { value }
            </Tab>
          )) }
        </TabsHeader>
      </Tabs>

      <Select
        label="Difficulty"
        onChange={ (difficulty) => applySearchParams({ difficulty }) }
        value={ searchParams.get('difficulty') || '' }
        className="capitalize">
        { Object.values(QuestionDifficulty).map((difficulty) => (
          <Option
            key={ difficulty }
            value={ difficulty }
            disabled={ difficulty === searchParams.get('difficulty') }
            className="capitalize">
            { difficulty }
          </Option>
        )) }
      </Select>

      <Select
        label="Type"
        onChange={ (type) => applySearchParams({ type }) }
        value={ searchParams.get('type') || '' }
        className="capitalize">
        { Object.values(QuestionType).map((type) => (
          <Option
            key={ type }
            value={ type }
            disabled={ type === searchParams.get('type') }
            className="capitalize">
            { type }
          </Option>
        )) }
      </Select>

      <Input
        label="Search"
        value={ searchParams.get('search') || '' }
        onChange={ (e) => applySearchParams({ search: e.target.value }) }
        icon={ <MagnifyingGlassIcon className="h-4 w-4"/> }/>

      <Select
        label="Size"
        onChange={ (size) => applySearchParams({ size }) }
        value={ searchParams.get('size') || '' }
        className="capitalize">
        { [ 1, 5, 10, 20, 30, 40, 50 ].map((size) => (
          <Option
            key={ size }
            value={ `${ size }` }
            disabled={ `${ size }` === searchParams.get('size') }>
            { size }
          </Option>
        )) }
      </Select>

      { questions && ((questions.meta.prevCursor || questions.meta.nextCursor) &&
        <ButtonGroup variant="outlined">
          <IconButton onClick={ () => applySearchParams({ prevCursor: questions?.meta.prevCursor }) }
                      disabled={ !questions.meta.prevCursor }>
            <ArrowLeftIcon className="w-4 h-4"/>
          </IconButton>
          <IconButton onClick={ () => applySearchParams({ nextCursor: questions?.meta.nextCursor }) }
                      disabled={ !questions.meta.nextCursor }>
            <ArrowRightIcon className="w-4 h-4"/>
          </IconButton>
        </ButtonGroup>) }

      { showClear() &&
        <div>
          <Button variant="outlined" onClick={ clearSearchParams }>Clear</Button>
        </div> }
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
      { !questions && <tr>
        <td colSpan={ tableColumns.length } className="p-5 text-center">
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
          <Spinner type="text" width="w-full"/>
        </td>
      </tr> }
      { questions && questions.data.length === 0 && <tr>
        <td colSpan={ tableColumns.length } className="p-5 text-center">No data</td>
      </tr> }
      { questions && questions.data && questions.data.map((question: Question, index) => (
        <tr key={ question.id }>
          <td>{ index + 1 }</td>

          <td className="truncate max-w-[400px]">
            <Tooltip content={ question.title }>
              <Link
                key={ question.id }
                to={ Route.QUESTION.replace(':categoryId', question.categoryId!).replace(':questionId', question.id!) }
              >
                { question.title }
              </Link>
            </Tooltip>
          </td>

          <td>{ question.difficulty }</td>

          <td>{ question.type }</td>

          <td><Rating readonly/></td>

          <td className="flex justify-end gap-1">
            { checkAuth(QuestionPermission.UPDATE, question) &&
              <AddQuestion question={ question } onSubmit={ onQuestionUpdated } iconButton/> }

            { checkAuth(QuestionPermission.DELETE, question) &&
              <DeleteQuestion question={ question } onSubmit={ onQuestionDeleted } iconButton/> }
          </td>
        </tr>
      )) }
      </tbody>
    </table>
  </>
}

export default memo(Category)