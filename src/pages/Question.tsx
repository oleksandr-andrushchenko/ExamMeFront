import { Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Checkbox } from '@material-tailwind/react'
import Route from '../enum/Route'
import { HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import Question from '../schema/question/Question'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { QuestionChoice, QuestionType } from '../schema/question/CreateQuestion'
import AddQuestion from '../components/question/AddQuestion'
import { apiQuery } from '../api/apolloClient'
import getQuestionForQuestionPage from '../api/question/getQuestionForQuestionPage'
import Error from '../components/Error'
import QuestionPermission from '../enum/question/QuestionPermission'
import H1 from '../components/typography/H1'
import Link from '../components/elements/Link'
import InfoTable from '../components/elements/InfoTable'
import { ApproveQuestion } from '../components/question/ApproveQuestion'
import CreatorBadge from '../components/badges/CreatorBadge'
import { RateQuestion } from '../components/question/RateQuestion'
import Buttons from '../components/elements/Buttons'

const Question = () => {
  const { questionId } = useParams<Params>() as { questionId: string }
  const [ question, setQuestion ] = useState<Question>()
  const [ infoTableKey, setInfoTableKey ] = useState<number>(1)
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { checkAuthorization } = useAuth()
  const navigate = useNavigate()

  const updateQuestion = (question: Question) => setQuestion(question)
  const refreshQuestion = () => apiQuery(
    getQuestionForQuestionPage(questionId),
    (data: { question: Question }) => setQuestion(data.question),
    setError,
    setLoading,
  )
  const refreshInfoTable = () => {
    setInfoTableKey(Math.random())
  }
  const updateQuestionAndRefreshInfoTable = (question: Question) => {
    updateQuestion(question)
    refreshInfoTable()
  }
  const onDelete = () => navigate(Route.Category.replace(':categoryId', question!.categoryId!), { replace: true })

  useEffect(() => {
    document.title = question?.title || 'ExamMe'
    refreshQuestion()
  }, [])

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
      <Link label="Categories" to={ Route.Categories }/>
      { !question ? <Spinner type="text"/> :
        <Link label={ question.category!.name } to={ Route.Category.replace(':categoryId', question.categoryId!) }/> }
      { !question ? <Spinner type="text"/> :
        <Link label={ question.title } to={ Route.Question.replace(':questionId', question.id!) }/> }
    </Breadcrumbs>

    <H1
      label={ question?.title ?? <Spinner type="text"/> }
      sup={ question?.isCreator ? <CreatorBadge/> : '' }
    />

    { question ?
      <RateQuestion
        question={ question }
        onChange={ updateQuestion }
        readonly={ !checkAuthorization(QuestionPermission.Rate) }
        showAverageMark
        showMarkCount
      /> : <Spinner type="text"/> }

    { error && <Error text={ error }/> }

    <Buttons
      className="mt-2"
      buttons={ {
        approve: !question ? <Spinner type="button"/> : (checkAuthorization(QuestionPermission.Approve) &&
          <ApproveQuestion question={ question } onChange={ updateQuestionAndRefreshInfoTable }/>),

        update: !question ? <Spinner type="button"/> : (checkAuthorization(QuestionPermission.Update, question) &&
          <AddQuestion question={ question } onSubmit={ updateQuestion }/>),

        delete: !question ? <Spinner type="button"/> : (checkAuthorization(QuestionPermission.Delete, question) &&
          <DeleteQuestion question={ question } onSubmit={ onDelete }/>),
      } }
    />

    <InfoTable
      className="mt-4"
      title="Question info"
      key2={ infoTableKey }
      columns={ [ 'Title', 'Category', 'Type', 'Choices', 'Difficulty', 'Rating', 'Approved' ] }
      source={ question }
      mapper={ (question: Question) => [
        question.title,
        question.category!.name,
        question.type,
        question.type === QuestionType.CHOICE ? (question.choices || []).map((choice: QuestionChoice, index) => (
          <Checkbox key={ `${ question.id }-${ index }` } name="choice" label={ choice.title } disabled={ true }/>
        )) : 'N/A',
        question.difficulty,
        <RateQuestion question={ question } readonly/>,
        <ApproveQuestion question={ question } readonly/>,
      ] }
    />
  </>
}

export default memo(Question)