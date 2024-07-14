import { Link, Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Checkbox, Input, Typography } from '@material-tailwind/react'
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

  const choices = (question: Question) => {
    if (question.type === QuestionType.CHOICE) {
      return (question.choices || []).map((choice: QuestionChoice, index) => (
        <Checkbox key={ `${ question.id }-${ index }` } name="choice" label={ choice.title } disabled={ true }/>
      ))
    }

    return (
      <Input type="text" name="answer" size="lg" label="Answer" disabled={ true }/>
    )
  }

  return <>
    <Breadcrumbs>
      <Link to={ Route.Home } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.Categories }>Categories</Link>
      { !question ? <Spinner type="text"/> :
        <Link to={ Route.Category.replace(':categoryId', question.categoryId!) }>{ question.category!.name }</Link> }
      { !question ? <Spinner type="text"/> :
        <Link to={ Route.Question.replace(':questionId', question.id!) }>{ question.title }</Link> }
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">{ !question ?
      <Spinner type="text"/> : question.title }</Typography>

    <Rating/>

    { error && <Error text={ error }/> }

    <Typography variant="small" className="mt-4">Question info</Typography>

    <table className="w-full table-auto text-left text-sm">
      <tbody>
      <tr>
        <th className="w-2/12">Title</th>
        <td>{ question ? question.title : <Spinner type="text"/> }</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>{ question ? question.category!.name : <Spinner type="text"/> }</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>{ question ? question.type : <Spinner type="text"/> }</td>
      </tr>
      <tr>
        <th>
          { !question ? <Spinner type="text"/> : (question.type === QuestionType.CHOICE ? 'Choices' : 'Answers') }
        </th>
        <td>
          { !question ? <Spinner type="text"/> : choices(question) }
        </td>
      </tr>
      <tr>
        <th>Difficulty</th>
        <td>{ question ? question.difficulty : <Spinner type="text"/> }</td>
      </tr>
      </tbody>
    </table>

    <div className="flex gap-1 items-center mt-4">
      { checkAuthorization(QuestionPermission.Update, question) && (!question ? <Spinner type="button"/> :
        <AddQuestion question={ question } onSubmit={ onQuestionUpdated }/>) }

      { checkAuthorization(QuestionPermission.Delete, question) && (!question ? <Spinner type="button"/> :
        <DeleteQuestion question={ question } onSubmit={ onQuestionDeleted }/>) }
    </div>
  </>
}

export default memo(Question)