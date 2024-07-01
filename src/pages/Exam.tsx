import { Link, Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, ButtonGroup, Checkbox, Input, Progress, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import ExamPermission from '../enum/exam/ExamPermission'
import DeleteExam from '../components/exam/DeleteExam'
import ExamQuestion from '../schema/exam/ExamQuestion'
import { QuestionChoice, QuestionType } from '../schema/question/QuestionTransfer'
import CompleteExam from '../components/exam/CompleteExam'
import { apiMutate, apiQuery } from '../api/apolloClient'
import answerExamQuestionMutation from '../api/exam/answerExamQuestionMutation'
import examPageExamQuestionQuery from '../api/exam/examPageExamQuestionQuery'
import examPageCurrentExamQuestionQuery from '../api/exam/examPageCurrentExamQuestionQuery'
import clearExamQuestionAnswerMutation from '../api/exam/clearExamQuestionAnswerMutation'
import Error from '../components/Error'
import Unauthenticated from './Unauthenticated'
import Unauthorized from './Unauthorized'
import Exam from '../schema/exam/Exam'

const Exam = () => {
  const { examId } = useParams<Params>() as { examId: string }
  const [ questionNumber, setQuestionNumber ] = useState<number>()
  const [ examQuestion, setExamQuestion ] = useState<ExamQuestion>()
  const [ answering, setAnswering ] = useState<boolean>(false)
  const [ clearing, setClearing ] = useState<boolean>(false)
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { auth, me, checkAuth } = useAuth()
  const navigate = useNavigate()
  const exam = examQuestion?.exam
  const category = exam?.category

  const onPrevQuestionClick = () => setQuestionNumber(getQuestionNumber() - 1)
  const onNextQuestionClick = () => setQuestionNumber(getQuestionNumber() + 1)
  const onExamCompleted = (exam: Exam) => setExamQuestion({ ...examQuestion, ...{ exam } })
  const onExamDeleted = () => navigate(Route.CATEGORY.replace(':categoryId', examQuestion!.exam!.categoryId!), { replace: true })

  const getQuestionNumber = (): number | undefined => {
    if (questionNumber !== undefined) {
      return questionNumber
    }

    if (examQuestion === undefined) {
      return undefined
    }

    return examQuestion?.number
  }
  const showPrev = (): boolean | undefined => {
    if (answering || clearing) {
      return false
    }

    const questionNumber = getQuestionNumber()

    if (questionNumber === undefined) {
      return undefined
    }

    return questionNumber > 0
  }
  const showNext = (): boolean | undefined => {
    if (answering || clearing) {
      return false
    }

    const questionNumber = getQuestionNumber()

    if (questionNumber === undefined) {
      return undefined
    }

    return questionNumber < examQuestion!.exam!.questionCount - 1
  }

  const createAnswer = (answer: number | string) => {
    const transfer = examQuestion!.question!.type === QuestionType.CHOICE
      ? { choice: answer as number }
      : { answer: answer as string }

    apiMutate<{ answerExamQuestion: ExamQuestion }>(
      answerExamQuestionMutation(examId, getQuestionNumber()!, transfer),
      data => setExamQuestion(data.answerExamQuestion),
      setError,
      setAnswering,
    )
  }

  const clearAnswer = () => {
    apiMutate<{ clearExamQuestionAnswer: ExamQuestion }>(
      clearExamQuestionAnswerMutation(examId, getQuestionNumber()!),
      data => setExamQuestion(data.clearExamQuestionAnswer),
      setError,
      setClearing,
    )
  }

  useEffect(() => {
    if (questionNumber === undefined) {
      apiQuery<{ currentExamQuestion: ExamQuestion }>(
        examPageCurrentExamQuestionQuery(examId),
        data => setExamQuestion(data.currentExamQuestion),
        setError,
        setLoading,
      )
    } else {
      apiQuery<{ examQuestion: ExamQuestion }>(
        examPageExamQuestionQuery(examId, questionNumber!),
        data => setExamQuestion(data.examQuestion),
        setError,
        setLoading,
      )
    }
  }, [ questionNumber ])

  useEffect(() => {
    document.title = `Exam: ${ examQuestion?.exam?.category?.name || 'ExamMe' }`
  }, [ examQuestion?.exam?.category?.name ])

  if (!auth) {
    return <Unauthenticated/>
  }

  if (!me) {
    return <Spinner/>
  }

  if (examQuestion && !checkAuth(ExamPermission.GET, examQuestion?.exam)) {
    return <Unauthorized/>
  }

  const layout = (header: string, body) => {
    return <>
      <Breadcrumbs>
        <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
        <Link to={ Route.CATEGORIES }>Categories</Link>
        { !examQuestion ? <Spinner type="text"/> :
          <Link to={ Route.CATEGORY.replace(':categoryId', examQuestion.exam!.categoryId!) }>
            { examQuestion.exam!.category!.name }
          </Link> }
        <Link to={ Route.EXAM.replace(':examId', examId) }>Exam</Link>
      </Breadcrumbs>

      <Typography as="h1" variant="h2" className="mt-1">
        Exam: { examQuestion ? examQuestion.exam!.category!.name : <Spinner type="text"/> }
      </Typography>

      <Typography variant="small" className="mt-1">{ header }</Typography>

      { error && <Error text={ error }/> }

      { body }
    </>
  }

  if (exam?.completedAt) {
    const score = Math.floor(100 * exam.correctAnswerCount / exam!.questionCount)
    const requiredScore = category?.requiredScore ?? 0
    const passed = score > requiredScore

    return layout('Exam completed', <>
      <table className="w-full table-auto text-left text-sm mt-4">
        <tbody>
        <tr>
          <th className="w-2/12">Completion date</th>
          <td>{ new Date(exam.completedAt).toDateString() }</td>
        </tr>
        <tr>
          <th>Correct answers</th>
          <td>{ exam.correctAnswerCount }/{ exam?.questionCount } ({ score }%)</td>
        </tr>
        <tr>
          <th>Required score</th>
          <td>{ requiredScore }%</td>
        </tr>
        <tr>
          <th>Passed</th>
          <td className={ `font-bold text-${ passed ? 'green' : 'red' }-700` }>{ passed ? 'Yes' : 'No' }</td>
        </tr>
        </tbody>
      </table>
    </>)
  }

  return layout('Exam questions', <>
    <div className="flex gap-1 items-center mt-4">
      { examQuestion &&
        <ButtonGroup variant="outlined">
          <Button onClick={ onPrevQuestionClick } disabled={ !showPrev() }>
            <ArrowLeftIcon className="inline-block w-4 h-4"/> Prev
          </Button>
          <Button onClick={ onNextQuestionClick } disabled={ !showNext() }>
            Next <ArrowRightIcon className="inline-block w-4 h-4"/>
          </Button>
        </ButtonGroup> }

      { examQuestion && checkAuth(ExamPermission.CREATE_COMPLETION, examQuestion.exam) &&
        <CompleteExam exam={ examQuestion.exam! } onSubmit={ onExamCompleted }/> }

      { examQuestion && checkAuth(ExamPermission.DELETE, examQuestion.exam) &&
        <DeleteExam exam={ examQuestion.exam! } onSubmit={ onExamDeleted }/> }
    </div>

    { !examQuestion ? <Spinner type="text" height="h-3"/> :
      <Progress
        value={ Math.floor(100 * (getQuestionNumber() + 1) / examQuestion.exam!.questionCount) }
        label="Steps"
        size="sm"
        className="mt-4"
      /> }

    { !examQuestion ? <Spinner type="text" height="h-4"/> :
      <Progress
        value={ Math.floor(100 * examQuestion.exam!.answeredQuestionCount / examQuestion.exam!.questionCount) }
        label="Answered"
        size="lg"
        className="mt-4"
      /> }

    { !examQuestion ? <Spinner type="text"/> :
      <Typography as="h2" variant="h6" className="mt-4">
        Question #{ getQuestionNumber() + 1 }: { examQuestion.question!.title }
      </Typography> }

    <div className="flex flex-col gap-8 mt-4">
      { !examQuestion ? <Spinner/> : (
        examQuestion.question!.type === QuestionType.CHOICE
          ? examQuestion.question!.choices!.map((choice: QuestionChoice, index) => (
            <Checkbox
              key={ `${ examQuestion.question!.id }-${ index }-${ examQuestion.choice }` }
              name="choice"
              defaultChecked={ index === examQuestion.choice }
              onChange={ (e) => e.target.checked ? createAnswer(index) : clearAnswer() }
              label={ choice.title }
              disabled={ answering }
            />
          ))
          : <Input
            type="text"
            name="answer"
            size="lg"
            label="Answer"
            onChange={ (e) => createAnswer(e.target.value) }
            disabled={ answering }
          />
      ) }
    </div>
  </>)
}

export default memo(Exam)