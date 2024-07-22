import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@material-tailwind/react'
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
import isQuestionApproved from '../services/questions/isQuestionApproved'
import InfoTable from '../components/elements/InfoTable'
import isCategoryApproved from '../services/categories/isCategoryApproved'
import YesNo from '../components/elements/YesNo'
import createListFromEnum from '../utils/createListFromEnum'

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

    <H1 sub="Category info">{ !category ? <Spinner type="text"/> : category.name }</H1>

    <Rating/>

    { error && <Error text={ error }/> }

    <InfoTable
      source={ category }
      columns={ [ 'Name', 'Questions', 'Required score', 'Approved', 'Rating' ] }
      mapper={ (category: Category) => [
        category.name,
        category.questionCount ?? 0,
        category.requiredScore ?? 0,
        <Rating readonly/>,
        <YesNo yes={ isCategoryApproved(category) }/>,
      ] }
    />

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
      tabs={ {
        subscription: [ 'yes', 'no' ],
        approved: [ 'yes', 'no' ],
      } }
      filters={ {
        difficulty: createListFromEnum(QuestionDifficulty),
      } }
      columns={ [ '#', 'Title', 'Choices', 'Difficulty', 'Approved', 'Rating', '' ] }
      queryOptions={ (filter) => getQuestionsForCategoryPage(categoryId, filter) }
      queryData={ (data: { paginatedQuestions: Paginated<Question> }) => data.paginatedQuestions }
      mapper={ (question: Question, index: number) => [
        question.id,
        index + 1,
        <Link label={ question.title } tooltip={ question.title }
              to={ Route.Question.replace(':categoryId', question.categoryId!).replace(':questionId', question.id!) }/>,
        question.type === QuestionType.CHOICE ? (question.choices || []).length : 'N/A',
        question.difficulty,
        <Rating readonly/>,
        <YesNo yes={ isQuestionApproved(question) }/>,
        {
          add: checkAuthorization(QuestionPermission.Update, question) &&
            <AddQuestion question={ question } onSubmit={ refresh } iconButton/>,

          delete: checkAuthorization(QuestionPermission.Delete, question) &&
            <DeleteQuestion question={ question } onSubmit={ refresh } iconButton/>,
        },
      ] }
    />
  </>
}

export default memo(Category)