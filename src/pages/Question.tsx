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
import YesNo from '../components/elements/YesNo'
import { ApproveQuestion } from '../components/question/ApproveQuestion'
import CreatorBadge from '../components/badges/CreatorBadge'
import { RateQuestion } from '../components/question/RateQuestion'

const Question = () => {
  const { questionId } = useParams<Params>() as { questionId: string }
  const [ question, setQuestion ] = useState<Question>()
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { checkAuthorization } = useAuth()
  const navigate = useNavigate()

  const onApprove = (question: Question) => setQuestion(question)
  const onUpdate = (question: Question) => setQuestion(question)
  const onDelete = () => navigate(Route.Category.replace(':categoryId', question!.categoryId!), { replace: true })

  useEffect(() => {
    document.title = question?.title || 'ExamMe'

    apiQuery<{ question: Question }>(
      getQuestionForQuestionPage(questionId),
      data => setQuestion(data.question),
      setError,
      setLoading,
    )
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
      sub="Question info"
    />

    { question ? <RateQuestion question={ question } showAverageMark showMarkCount/> : <Spinner type="text"/> }

    { error && <Error text={ error }/> }

    <InfoTable
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
        <RateQuestion question={ question } readonly={ !checkAuthorization(QuestionPermission.Rate) }/>,
        <YesNo yes={ question.isApproved }/>,
      ] }
    />

    <div className="flex gap-1 items-center mt-4">
      { !question ? <Spinner type="button"/> : (checkAuthorization(QuestionPermission.Approve) &&
        <ApproveQuestion question={ question } onChange={ onApprove }/>) }

      { !question ? <Spinner type="button"/> : (checkAuthorization(QuestionPermission.Update, question) &&
        <AddQuestion question={ question } onSubmit={ onUpdate }/>) }

      { !question ? <Spinner type="button"/> : (checkAuthorization(QuestionPermission.Delete, question) &&
        <DeleteQuestion question={ question } onSubmit={ onDelete }/>) }
    </div>
  </>
}

export default memo(Question)