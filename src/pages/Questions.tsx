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
import Rating from '../components/Rating'
import { apiQuery } from '../api/apolloClient'
import getQuestionsForQuestionsPage from '../api/question/getQuestionsForQuestionsPage'
import QuestionPermission from '../enum/question/QuestionPermission'
import { ListIcon } from '../registry/icons'
import Table from '../components/elements/Table'
import getCategoriesForSelect from '../api/category/getCategoriesForSelect'
import Error from '../components/Error'
import { QuestionDifficulty } from '../schema/question/CreateQuestion'
import H1 from '../components/typography/H1'
import Link from '../components/elements/Link'
import isQuestionApproved from '../services/questions/isQuestionApproved'
import YesNo from '../components/elements/YesNo'
import createListFromObjects from '../utils/createListFromObjects'
import createListFromEnum from '../utils/createListFromEnum'

const Questions = () => {
  const [ tableKey, setTableKey ] = useState<number>(2)
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
      tabs={ {
        subscription: [ 'yes', 'no' ],
        approved: [ 'yes', 'no' ],
      } }
      columns={ [ '#', 'Title', 'Category', 'Difficulty', 'Rating', 'Approved', '' ] }
      queryOptions={ (filter) => getQuestionsForQuestionsPage(filter) }
      queryData={ (data: { paginatedQuestions: Paginated<Question> }) => data.paginatedQuestions }
      filters={ {
        category: createListFromObjects(categories || [], 'id', 'name'),
        difficulty: createListFromEnum(QuestionDifficulty),
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
        <Rating readonly/>,
        <YesNo yes={ isQuestionApproved(question) }/>,
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