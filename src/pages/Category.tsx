import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Option, Select, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import Category from '../schema/category/Category'
import Question from '../schema/question/Question'
import DeleteCategory from '../components/category/DeleteCategory'
import AddQuestion from '../components/question/AddQuestion'
import AddCategory from '../components/category/AddCategory'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { QuestionDifficulty, QuestionType } from '../schema/question/CreateQuestion'
import AddExam from '../components/exam/AddExam'
import Rating from '../components/Rating'
import { apiQuery } from '../api/apolloClient'
import getCategoryForCategoryPage from '../api/category/getCategoryAndQuestionsForCategoryPage'
import Error from '../components/Error'
import CategoryPermission from '../enum/category/CategoryPermission'
import QuestionPermission from '../enum/question/QuestionPermission'
import Paginated from '../schema/pagination/Paginated'
import Table from '../components/elements/Table'
import getQuestionsForCategoryPage from '../api/category/getQuestionsForCategoryPage'
import Link from '../components/elements/Link'
import H1 from '../components/typography/H1'

const Category = () => {
  const [ tableKey, setTableKey ] = useState<number>(1)
  const refresh = () => setTableKey(Math.random())
  const { checkAuthorization } = useAuth()
  const { categoryId }: { categoryId: string } = useParams()
  const [ category, setCategory ] = useState<Category>()
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    apiQuery(
      getCategoryForCategoryPage(categoryId),
      (data: { category: Category }) => setCategory(data.category),
      setError,
      setLoading,
    )
  }, [])

  useEffect(() => {
    document.title = category?.name || 'ExamMe'
  }, [ category ])

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
      <Link label="Categories" to={ Route.Categories }/>
      { !category ? <Spinner type="text"/> :
        <Link label={ category.name } to={ Route.Category.replace(':categoryId', category.id!) }/> }
    </Breadcrumbs>

    <H1>{ !category ? <Spinner type="text"/> : category.name }</H1>

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

    <Table
      key2={ tableKey }
      buttons={ {
        create: !category ? <Spinner type="button"/> : <AddQuestion category={ category } onSubmit={ refresh }/>,
        update: checkAuthorization(CategoryPermission.Update, category) && (!category ? <Spinner type="button"/> :
          <AddCategory category={ category } onSubmit={ (category: Category) => setCategory(category) }/>),
        delete: checkAuthorization(CategoryPermission.Delete, category) && (!category ? <Spinner type="button"/> :
          <DeleteCategory category={ category } onSubmit={ () => navigate(Route.Categories, { replace: true }) }/>),
        exam: !category ? <Spinner type="button"/> : !!category.questionCount && <AddExam category={ category }/>,
      } }
      tabs={ [ 'all', 'free', 'subscription' ] }
      columns={ [ '#', 'Title', 'Difficulty', 'Type', 'Rating', '' ] }
      queryOptions={ (filter) => getQuestionsForCategoryPage(categoryId, filter) }
      queryData={ (data: { paginatedQuestions: Paginated<Question> }) => data.paginatedQuestions }
      filters={ {
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
        <Link label={ question.title } tooltip={ question.title } to={ Route.Question.replace(':categoryId', question.categoryId!).replace(':questionId', question.id!) }/>,
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

export default memo(Category)