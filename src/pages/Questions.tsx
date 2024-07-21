import { Breadcrumbs, Option, Select, Tooltip } from '@material-tailwind/react'
import Route from '../enum/Route'
import { HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import Question from '../schema/question/Question'
import AddQuestion from '../components/question/AddQuestion'
import DeleteQuestion from '../components/question/DeleteQuestion'
import Paginated from '../schema/pagination/Paginated'
import Category from '../schema/category/Category'
import Rating from '../components/Rating'
import { apiQuery } from '../api/apolloClient'
import getQuestionsForQuestionsPage from '../api/question/getQuestionsForQuestionsPage'
import QuestionPermission from '../enum/question/QuestionPermission'
import { ListIcon } from '../registry/icons'
import Table from '../components/elements/Table'
import getCategoriesForSelect from '../api/category/getCategoriesForSelect'
import Error from '../components/Error'
import { QuestionDifficulty, QuestionType } from '../schema/question/CreateQuestion'
import H1 from '../components/typography/H1'
import Link from '../components/elements/Link'

const Questions = () => {
  const [ tableKey, setTableKey ] = useState<number>(1)
  const refresh = () => setTableKey(Math.random())
  const { checkAuthorization } = useAuth()
  const [ categories, setCategories ] = useState<Category[]>()
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')

  useEffect(() => {
    apiQuery(
      getCategoriesForSelect(),
      (data: { categories: Category[] }) => setCategories(data.categories),
      setError,
      setLoading,
    )
  }, [])

  useEffect(() => {
    document.title = 'Questions'
  }, [])

  const getCategory = (id: string): Category => (categories || []).filter((category: Category): boolean => category.id === id)[0]

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
      <Link label="Questions" to={ Route.Questions }/>
    </Breadcrumbs>

    <H1 icon={ ListIcon } label="Questions" sub="Questions info"/>

    { error && <Error text={ error }/> }

    <Table
      key2={ tableKey }
      buttons={ {
        create: <AddQuestion onSubmit={ refresh }/>,
      } }
      tabs={ [ 'all', 'free', 'subscription' ] }
      columns={ [ '#', 'Title', 'Category', 'Difficulty', 'Type', 'Rating', '' ] }
      queryOptions={ (filter) => getQuestionsForQuestionsPage(filter) }
      queryData={ (data: { paginatedQuestions: Paginated<Question> }) => data.paginatedQuestions }
      filters={ {
        category: (searchParams, applySearchParams) => !categories ? <Spinner type="button"/> : (
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
        ),
        difficulty: (searchParams, applySearchParams) => <Select
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
        </Select>,
        type: (searchParams, applySearchParams) => <Select
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
        </Select>,
      } }
      mapper={ (question: Question, index: number) => [
        question.id,
        index + 1,
        <Link label={ question.title } tooltip={ question.title }
              to={ Route.Question.replace(':categoryId', question.categoryId!).replace(':questionId', question.id!) }/>,
        !categories ? <Spinner/> : (
          <Tooltip content={ getCategory(question.categoryId!).name }>
            { getCategory(question.categoryId!).name }
          </Tooltip>
        ),
        question.difficulty,
        question.type,
        <Rating readonly/>,
        <span className="flex justify-end gap-1">
          { checkAuthorization(QuestionPermission.Update, question) &&
            <AddQuestion question={ question } onSubmit={ refresh } iconButton/> }

          { checkAuthorization(QuestionPermission.Delete, question) &&
            <DeleteQuestion question={ question } onSubmit={ refresh } iconButton/> }
        </span>,
      ] }
    />
  </>
}

export default memo(Questions)