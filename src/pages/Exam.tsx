import { Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, ButtonGroup, Checkbox, Input, Progress } from '@material-tailwind/react'
import Route from '../enum/Route'
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import ExamPermission from '../enum/exam/ExamPermission'
import DeleteExam from '../components/exam/DeleteExam'
import ExamQuestion from '../schema/exam/ExamQuestion'
import { QuestionType } from '../schema/question/CreateQuestion'
import CompleteExam from '../components/exam/CompleteExam'
import { apiMutate, apiQuery } from '../api/apolloClient'
import createExamQuestionAnswer from '../api/exam/createExamQuestionAnswer'
import getExamQuestion from '../api/exam/getExamQuestion'
import getCurrentExamQuestion from '../api/exam/getCurrentExamQuestion'
import deleteExamQuestionAnswer from '../api/exam/deleteExamQuestionAnswer'
import Error from '../components/Error'
import Unauthenticated from './Unauthenticated'
import Unauthorized from './Unauthorized'
import Exam from '../schema/exam/Exam'
import H1 from '../components/typography/H1'
import Link from '../components/elements/Link'
import H2 from '../components/typography/H2'
import Button from '../components/elements/Button'

const Exam = () => {
  const { examId } = useParams<Params>() as { examId: string }
  const [ questionNumber, setQuestionNumber ] = useState<number>()
  const [ examQuestion, setExamQuestion ] = useState<ExamQuestion>()
  const [ answering, setAnswering ] = useState<boolean>(false)
  const [ clearing, setClearing ] = useState<boolean>(false)
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { authenticationToken, me, checkAuthorization } = useAuth()
  const navigate = useNavigate()
  const exam = examQuestion?.exam
  const category = exam?.category

  const onPrevQuestionClick = () => setQuestionNumber(getQuestionNumber() - 1)
  const onNextQuestionClick = () => setQuestionNumber(getQuestionNumber() + 1)
  const onExamCompleted = (exam: Exam) => setExamQuestion({ ...examQuestion, ...{ exam } })
  const onExamDeleted = () => navigate(Route.Category.replace(':categoryId', examQuestion!.exam!.categoryId!), { replace: true })

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

    apiMutate(
      createExamQuestionAnswer(examId, getQuestionNumber()!, transfer),
      (data: { createExamQuestionAnswer: ExamQuestion }) => setExamQuestion(data.createExamQuestionAnswer),
      setError,
      setAnswering,
    )
  }

  const clearAnswer = () => {
    apiMutate(
      deleteExamQuestionAnswer(examId, getQuestionNumber()!),
      (data: { deleteExamQuestionAnswer: ExamQuestion }) => setExamQuestion(data.deleteExamQuestionAnswer),
      setError,
      setClearing,
    )
  }

  useEffect(() => {
    if (questionNumber === undefined) {
      apiQuery(
        getCurrentExamQuestion(examId),
        (data: { currentExamQuestion: ExamQuestion }) => setExamQuestion(data.currentExamQuestion),
        setError,
        setLoading,
      )
    } else {
      apiQuery(
        getExamQuestion(examId, questionNumber!),
        (data: { examQuestion: ExamQuestion }) => setExamQuestion(data.examQuestion),
        setError,
        setLoading,
      )
    }
  }, [ questionNumber ])

  useEffect(() => {
    document.title = `Exam: ${ examQuestion?.exam?.category?.name || 'ExamMe' }`
  }, [ examQuestion?.exam?.category?.name ])

  if (!authenticationToken) {
    return <Unauthenticated/>
  }

  if (!me) {
    return <Spinner/>
  }

  if (examQuestion && !checkAuthorization(ExamPermission.Get, examQuestion?.exam)) {
    return <Unauthorized/>
  }

  const layout = (header: string, body) => {
    return <>
      <Breadcrumbs>
        <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
        <Link label="Categories" to={ Route.Categories }/>
        { !examQuestion ? <Spinner type="text"/> : <Link label={ examQuestion.exam!.category!.name }
                                                         to={ Route.Category.replace(':categoryId', examQuestion.exam!.categoryId!) }/> }
        <Link label="Exam" to={ Route.Exam.replace(':examId', examId) }/>
      </Breadcrumbs>

      <H1 sub={ header }>Exam: { examQuestion ? examQuestion.exam!.category!.name : <Spinner type="text"/> }</H1>

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
          <Button icon={ ArrowLeftIcon } label="Prev" onClick={ onPrevQuestionClick } disabled={ !showPrev() }/>
          <Button icon={ ArrowRightIcon } label="Next" onClick={ onNextQuestionClick } disabled={ !showNext() }/>
        </ButtonGroup> }

      { examQuestion && checkAuthorization(ExamPermission.CreateCompletion, examQuestion.exam) &&
        <CompleteExam exam={ examQuestion.exam! } onSubmit={ onExamCompleted }/> }

      { examQuestion && checkAuthorization(ExamPermission.Delete, examQuestion.exam) &&
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
      <H2>Question #{ getQuestionNumber() + 1 }: { examQuestion.question!.title }</H2> }

    <div className="flex flex-col gap-8 mt-4">
      { !examQuestion ? <Spinner/> : (
        examQuestion.question!.type === QuestionType.CHOICE
          ? examQuestion!.choices!.map((choice: string, index) => (
            <Checkbox
              key={ `${ examQuestion.question!.id }-${ index }-${ examQuestion.choice }` }
              name="choice"
              defaultChecked={ index === examQuestion.choice }
              onChange={ (e) => e.target.checked ? createAnswer(index) : clearAnswer() }
              label={ choice }
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