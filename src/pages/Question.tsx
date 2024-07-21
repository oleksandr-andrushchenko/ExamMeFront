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
import Rating from '../components/Rating'
import { apiQuery } from '../api/apolloClient'
import getQuestionForQuestionPage from '../api/question/getQuestionForQuestionPage'
import Error from '../components/Error'
import QuestionPermission from '../enum/question/QuestionPermission'
import H1 from '../components/typography/H1'
import Link from '../components/elements/Link'
import InfoTable from '../components/elements/InfoTable'
import YesNo from '../components/elements/YesNo'
import isQuestionApproved from '../services/questions/isQuestionApproved'

const Question = () => {
  const { questionId } = useParams<Params>() as { questionId: string }
  const [ question, setQuestion ] = useState<Question>()
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { checkAuthorization } = useAuth()
  const navigate = useNavigate()

  const onQuestionUpdated = (question: Question) => setQuestion(question)
  const onQuestionDeleted = () => navigate(Route.Category.replace(':categoryId', question!.categoryId!), { replace: true })

  useEffect(() => {
    apiQuery<{ question: Question }>(
      getQuestionForQuestionPage(questionId),
      data => setQuestion(data.question),
      setError,
      setLoading,
    )
  }, [])

  useEffect(() => {
    document.title = question?.title || 'ExamMe'
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

    <H1 sub="Question info">{ !question ? <Spinner type="text"/> : question.title }</H1>

    <Rating/>

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
        <Rating readonly/>,
        <YesNo yes={ isQuestionApproved(question) }/>,
      ] }
    />

    <div className="flex gap-1 items-center mt-4">
      { checkAuthorization(QuestionPermission.Update, question) && (!question ? <Spinner type="button"/> :
        <AddQuestion question={ question } onSubmit={ onQuestionUpdated }/>) }

      { checkAuthorization(QuestionPermission.Delete, question) && (!question ? <Spinner type="button"/> :
        <DeleteQuestion question={ question } onSubmit={ onQuestionDeleted }/>) }
    </div>
  </>
}

export default memo(Question)