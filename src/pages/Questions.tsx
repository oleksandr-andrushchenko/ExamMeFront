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
import { memo, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import Question from '../schema/question/Question'
import AddQuestion from '../components/question/AddQuestion'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { QuestionDifficulty, QuestionType } from '../schema/question/QuestionTransfer'
import Paginated from '../schema/pagination/Paginated'
import Category from '../schema/category/Category'
import Rating from '../components/Rating'
import QuestionQuery from '../schema/question/QuestionQuery'
import urlSearchParamsToPlainObject from '../utils/urlSearchParamsToPlainObject'
import { apiQuery } from '../api/apolloClient'
import questionsPageQuestionsQuery from '../api/question/questionsPageQuestionsQuery'
import questionsPageQuestionsAndCategoriesQuery from '../api/question/questionsPageQuestionsAndCategoriesQuery'
import Error from '../components/Error'
import QuestionPermission from '../enum/question/QuestionPermission'

const Questions = () => {
  const [ _, setLoading ] = useState<boolean>(true)
  const [ withCategories, setWithCategories ] = useState<boolean>(true)
  const defaultSearchParams = { size: '20' }
  const [ searchParams, setSearchParams ] = useSearchParams(defaultSearchParams)
  const [ categories, setCategories ] = useState<Category[]>()
  const [ questions, setQuestions ] = useState<Paginated<Question>>()
  const [ error, setError ] = useState<string>('')
  const { checkAuth } = useAuth()

  const onQuestionCreated = () => refresh()
  const onQuestionUpdated = () => refresh()
  const onQuestionDeleted = () => refresh()

  const refresh = (): true => {
    setLoading(true)
    const filter: QuestionQuery = urlSearchParamsToPlainObject(searchParams)

    if (withCategories) {
      setWithCategories(false)

      apiQuery<{ paginatedQuestions: Paginated<Question>, categories: Category[] }>(
        questionsPageQuestionsAndCategoriesQuery(filter),
        data => {
          setCategories(data.categories)
          setQuestions(data.paginatedQuestions)
        },
        setError,
        setLoading,
      )
    } else {
      apiQuery<{ paginatedQuestions: Paginated<Question> }>(
        questionsPageQuestionsQuery(filter),
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

  const tableFilters = [ 'all', 'free', 'subscription' ]
  const tableColumns = [ '#', 'Title', 'Category', 'Difficulty', 'Type', 'Rating', '' ]
  const showClear = (): boolean => {
    const def = new URLSearchParams(defaultSearchParams)
    def.sort()
    searchParams.sort()

    return def.toString() !== searchParams.toString()
  }
  const getCategory = (id: string): Category => (categories || []).filter((category: Category): boolean => category.id === id)[0]

  useEffect(() => {
    refresh()
  }, [ searchParams ])

  useEffect(() => {
    document.title = 'Questions'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Questions</Link>
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">Questions</Typography>

    <Typography variant="small" className="mt-1">Questions info</Typography>

    { error && <Error text={ error }/> }

    <div className="flex gap-1 items-center mt-4">
      { checkAuth(QuestionPermission.CREATE) && <AddQuestion onSubmit={ onQuestionCreated }/> }
    </div>

    <div className="flex gap-1 items-center mt-4">
      <Tabs value="all" className="min-w-[170px]">
        <TabsHeader>
          { tableFilters.map((value) => (
            <Tab
              key={ value }
              value={ value }
              className="text-xs small text-small"
              onClick={ () => applySearchParams({ price: value === 'all' ? undefined : value }) }
            >
              { value }
            </Tab>
          )) }
        </TabsHeader>
      </Tabs>

      { !categories ? <Spinner type="button"/> : (
        <Select
          label="Category"
          onChange={ (categoryId) => applySearchParams({ categoryId }) }
          value={ searchParams.get('categoryId') || '' }
          className="capitalize"
        >
          { categories.map((category: Category) => (
            <Option
              key={ category.id }
              value={ category.id }
              disabled={ category.id === searchParams.get('categoryId') }
              className="capitalize truncate max-w-[170px]"
            >
              { category.name }
            </Option>
          )) }
        </Select>
      ) }

      <Select
        label="Difficulty"
        onChange={ (difficulty) => applySearchParams({ difficulty }) }
        value={ searchParams.get('difficulty') || '' }
        className="capitalize"
      >
        { Object.values(QuestionDifficulty).map((difficulty) => (
          <Option
            key={ difficulty }
            value={ difficulty }
            disabled={ difficulty === searchParams.get('difficulty') }
            className="capitalize"
          >
            { difficulty }
          </Option>
        )) }
      </Select>

      <Select
        label="Type"
        onChange={ (type) => applySearchParams({ type }) }
        value={ searchParams.get('type') || '' }
        className="capitalize"
      >
        { Object.values(QuestionType).map((type: string) => (
          <Option
            key={ type }
            value={ type }
            disabled={ type === searchParams.get('type') }
            className="capitalize"
          >
            { type }
          </Option>
        )) }
      </Select>

      <Input
        label="Search"
        value={ searchParams.get('search') || '' }
        onChange={ (e) => applySearchParams({ search: e.target.value }) }
        icon={ <MagnifyingGlassIcon className="h-4 w-4"/> }
      />

      <Select
        label="Size"
        onChange={ (size) => applySearchParams({ size }) }
        value={ searchParams.get('size') || '' }
        className="capitalize"
      >
        { [ 1, 5, 10, 20, 30, 40, 50 ].map((size) => (
          <Option
            key={ size }
            value={ `${ size }` }
            disabled={ `${ size }` === searchParams.get('size') }
          >
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

      { showClear() && <div>
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
      { questions && questions.data && questions.data.filter((question) => getCategory(question.categoryId!)).map((question: Question, index) => (
        <tr key={ question.id }>
          <td>{ index + 1 }</td>

          <td className="truncate max-w-[250px]">
            <Tooltip content={ question.title }>
              <Link
                key={ question.id }
                to={ Route.QUESTION.replace(':categoryId', question.categoryId!).replace(':questionId', question.id!) }
              >
                { question.title }
              </Link>
            </Tooltip>
          </td>

          <td className="truncate max-w-[100px]">
            { !categories ? <Spinner/> : (
              <Tooltip content={ getCategory(question.categoryId!).name }>
                { getCategory(question.categoryId!).name }
              </Tooltip>
            ) }
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

export default memo(Questions)