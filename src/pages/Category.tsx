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
import { apiQuery } from '../api/apolloClient'
import getCategoryForCategoryPage from '../api/category/getCategoryForCategoryPage'
import Error from '../components/Error'
import CategoryPermission from '../enum/category/CategoryPermission'
import QuestionPermission from '../enum/question/QuestionPermission'
import Paginated from '../schema/pagination/Paginated'
import Table from '../components/elements/Table'
import getQuestionsForCategoryPage from '../api/category/getQuestionsForCategoryPage'
import Link from '../components/elements/Link'
import H1 from '../components/typography/H1'
import InfoTable from '../components/elements/InfoTable'
import YesNo from '../components/elements/YesNo'
import createListFromEnum from '../utils/createListFromEnum'
import { ApproveQuestion } from '../components/question/ApproveQuestion'
import { ApproveCategory } from '../components/category/ApproveCategory'
import { default as YesNoEnum } from '../enum/YesNo'
import canAddExam from '../services/exams/canAddExam'
import CreatorBadge from '../components/badges/CreatorBadge'
import { RateQuestion } from '../components/question/RateQuestion'
import { RateCategory } from '../components/category/RateCategory'

const Category = () => {
  const [ tableKey, setTableKey ] = useState<number>(1)
  const { authenticationToken, checkAuthorization } = useAuth()
  const { categoryId }: { categoryId: string } = useParams()
  const [ category, setCategory ] = useState<Category>()
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  const onApprove = (category: Category) => setCategory(category)
  const onUpdate = (category: Category) => setCategory(category)
  const onDelete = () => navigate(Route.Categories, { replace: true })

  const refresh = () => {
    apiQuery(
      getCategoryForCategoryPage(categoryId),
      (data: { category: Category }) => setCategory(data.category),
      setError,
      setLoading,
    )
    setTableKey(Math.random())
  }

  useEffect(() => {
    refresh()
  }, [ authenticationToken ])

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

    <H1
      label={ category?.name ?? <Spinner type="text"/> }
      sup={ category?.isCreator ? <CreatorBadge/> : '' }
      sub="Category info"
    />

    { category ?
      <RateCategory category={ category } readonly={ !checkAuthorization(CategoryPermission.Rate) } showAverageMark
                    showMarkCount/> : <Spinner type="text"/> }

    { error && <Error text={ error }/> }

    <InfoTable
      source={ category }
      columns={ [ 'Name', 'Questions', 'Required score', 'Approved', 'Rating' ] }
      mapper={ (category: Category) => [
        category.name,
        `${ category.approvedQuestionCount ?? 0 }/${ category.questionCount ?? 0 }`,
        category.requiredScore ?? 0,
        <YesNo yes={ category.isApproved }/>,
        <RateCategory category={ category } readonly={ !checkAuthorization(CategoryPermission.Rate) }/>,
      ] }
    />

    <Table
      key2={ tableKey }
      buttons={ {
        create: !category ? <Spinner type="button"/> : <AddQuestion category={ category } onSubmit={ refresh }/>,

        approve: !category ? <Spinner type="button"/> : (checkAuthorization(CategoryPermission.Approve) &&
          <ApproveCategory category={ category } onChange={ onApprove }/>),

        update: checkAuthorization(CategoryPermission.Update, category) && (!category ? <Spinner type="button"/> :
          <AddCategory category={ category } onSubmit={ onUpdate }/>),

        delete: checkAuthorization(CategoryPermission.Delete, category) && (!category ? <Spinner type="button"/> :
          <DeleteCategory category={ category } onSubmit={ onDelete }/>),

        exam: !category ? <Spinner type="button"/> : canAddExam(category) && <AddExam category={ category }/>,
      } }
      tabs={ {
        // subscription: Object.values(YesNoEnum),
        approved: Object.values(YesNoEnum),
        // creator: authenticationToken ? Object.values(Creator) : '',
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
        <Link
          label={ question.title }
          sup={ question.isCreator ? <CreatorBadge/> : '' }
          tooltip={ question.title }
          to={ Route.Question.replace(':categoryId', question.categoryId!).replace(':questionId', question.id!) }
        />,
        question.type === QuestionType.CHOICE ? (question.choices || []).length : 'N/A',
        question.difficulty,
        <ApproveQuestion question={ question } readonly={ !checkAuthorization(QuestionPermission.Approve) }
                         onChange={ refresh } iconButton/>,
        <RateQuestion question={ question } readonly={ !checkAuthorization(QuestionPermission.Rate) }/>,
        {
          update: checkAuthorization(QuestionPermission.Update, question) &&
            <AddQuestion question={ question } onSubmit={ refresh } iconButton/>,

          delete: checkAuthorization(QuestionPermission.Delete, question) &&
            <DeleteQuestion question={ question } onSubmit={ refresh } iconButton/>,
        },
      ] }
    />
  </>
}

export default memo(Category)