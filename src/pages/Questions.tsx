import { Breadcrumbs, Tooltip } from '@material-tailwind/react'
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
import createListFromObjects from '../utils/createListFromObjects'
import createListFromEnum from '../utils/createListFromEnum'
import { ApproveQuestion } from '../components/question/ApproveQuestion'
import { default as YesNoEnum } from '../enum/YesNo'
import CreatorBadge from '../components/badges/CreatorBadge'
import { RateQuestion } from '../components/question/RateQuestion'

const Questions = () => {
  const [ tableKey, setTableKey ] = useState<number>(2)
  const refresh = () => setTableKey(Math.random())
  const { authenticationToken, checkAuthorization } = useAuth()
  const [ categories, setCategories ] = useState<Category[]>()
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')

  useEffect(() => {
    apiQuery(
      // todo: search box instead of whole categories list (or categories of page questions - add GetCategories.categoryIds support)
      getCategoriesForSelect(),
      (data: { categories: Category[] }) => setCategories(data.categories),
      setError,
      setLoading,
    )
  }, [])

  useEffect(() => {
    refresh()
  }, [ authenticationToken ])

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
      tabs={ {
        // subscription: Object.values(YesNoEnum),
        approved: Object.values(YesNoEnum),
        // creator: authenticationToken ? Object.values(Creator) : '',
      } }
      filters={ {
        category: createListFromObjects(categories || [], 'id', 'name'),
        difficulty: createListFromEnum(QuestionDifficulty),
      } }
      columns={ [ '#', 'Title', 'Category', 'Choices', 'Difficulty', 'Approved', 'Rating', '' ] }
      queryOptions={ (filter) => getQuestionsForQuestionsPage(filter) }
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
        !categories ? <Spinner/> : <Tooltip
          content={ getCategory(question.categoryId!).name }>{ getCategory(question.categoryId!).name }</Tooltip>,
        question.type === QuestionType.CHOICE ? (question.choices || []).length : 'N/A',
        question.difficulty,
        <ApproveQuestion question={ question } onSubmit={ refresh } iconButton
                         readonly={ !checkAuthorization(QuestionPermission.Approve) }/>,
        <RateQuestion question={ question } readonly={ !checkAuthorization(QuestionPermission.Rate) }/>,
        // todo: include table items loading in submission request (instead of refresh call should be smth like: data => table.setItems(data.questions))
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

export default memo(Questions)