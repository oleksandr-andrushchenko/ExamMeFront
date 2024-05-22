import { Link, Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Input, Progress, Radio, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { ArrowLeftIcon, ArrowRightIcon, ExclamationCircleIcon, HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import ExamPermission from '../enum/exam/ExamPermission'
import DeleteExam from '../components/exam/DeleteExam'
import ExamQuestion from '../schema/exam/ExamQuestion'
import { QuestionChoice, QuestionType } from '../schema/question/QuestionTransfer'
import CompleteExam from '../components/exam/CompleteExam'
import { apiMutate, apiQuery } from '../api/apolloClient'
import addExamQuestionAnswerMutation from '../api/exam/addExamQuestionAnswerMutation'
import examPageExamQuestionQuery from '../api/exam/examPageExamQuestionQuery'
import examPageCurrentExamQuestionQuery from '../api/exam/examPageCurrentExamQuestionQuery'

export default function Exam(): ReactNode {
  const { examId } = useParams<Params>() as { examId: string }
  const [ questionNumber, setQuestionNumber ] = useState<number>()
  const [ examQuestion, setExamQuestion ] = useState<ExamQuestion>()
  const [ answering, setAnswering ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const onPrevQuestionClick = () => setQuestionNumber(getQuestionNumber() - 1)
  const onNextQuestionClick = () => setQuestionNumber(getQuestionNumber() + 1)
  const onExamCompleted = () => navigate(Route.CATEGORY.replace(':categoryId', examQuestion!.exam!.categoryId!), { replace: true })
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
    if (answering) {
      return false
    }

    const questionNumber = getQuestionNumber()

    if (questionNumber === undefined) {
      return undefined
    }

    return questionNumber > 0
  }
  const showNext = (): boolean | undefined => {
    if (answering) {
      return false
    }

    const questionNumber = getQuestionNumber()

    if (questionNumber === undefined) {
      return undefined
    }

    return questionNumber < examQuestion!.exam!.questionCount - 1
  }

  const createAnswer = (answer: number | string): void => {
    const transfer = examQuestion!.question!.type === QuestionType.CHOICE
      ? { choice: answer as number }
      : { answer: answer as string }

    apiMutate<{ addExamQuestionAnswer: ExamQuestion }>(
      addExamQuestionAnswerMutation(examId, getQuestionNumber()!, transfer),
      (data): void => setExamQuestion(data.addExamQuestionAnswer),
      setError,
      setAnswering,
    )
  }

  useEffect(() => {
    if (questionNumber === undefined) {
      apiQuery<{ currentExamQuestion: ExamQuestion }>(
        examPageCurrentExamQuestionQuery(examId),
        (data): void => setExamQuestion(data.currentExamQuestion),
        setError,
        setLoading,
      )
    } else {
      apiQuery<{ examQuestion: ExamQuestion }>(
        examPageExamQuestionQuery(examId, questionNumber!),
        (data): void => setExamQuestion(data.examQuestion),
        setError,
        setLoading,
      )
    }
  }, [ questionNumber ])

  useEffect(() => {
    document.title = `Exam: ${ examQuestion?.exam?.category?.name || 'ExamMe' }`
  }, [ examQuestion?.exam?.category?.name ])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { examQuestion === undefined ? <Spinner/> :
        <Link
          to={ Route.CATEGORY.replace(':categoryId', examQuestion.exam!.categoryId!) }>{ examQuestion.exam!.category!.name }</Link> }
      <Link to={ Route.EXAM.replace(':examId', examId) }>Exam</Link>
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">Exam: { examQuestion === undefined ?
      <Spinner/> : examQuestion.exam!.category!.name }</Typography>

    <Typography variant="small" className="mt-1">Exam questions</Typography>

    { error && <Typography
      variant="small"
      color="red"
      className="flex items-center gap-1 font-normal">
      <ExclamationCircleIcon className="w-1/12"/>
      <span className="w-11/12">{ error }</span>
    </Typography> }

    <div className="flex gap-1 items-center mt-4">
      { showPrev() &&
        <Button color="green" onClick={ onPrevQuestionClick }><ArrowLeftIcon
          className="inline-block h-4 w-4"/> Prev</Button> }
      { showNext() &&
        <Button color="green" onClick={ onNextQuestionClick }>Next <ArrowRightIcon
          className="inline-block h-4 w-4"/></Button> }

      { examQuestion === undefined ? <Spinner/> : (checkAuth(ExamPermission.CREATE_COMPLETION, examQuestion.exam) &&
        <CompleteExam exam={ examQuestion.exam! } onSubmit={ onExamCompleted }/>) }

      { examQuestion === undefined ? <Spinner/> : (checkAuth(ExamPermission.DELETE, examQuestion.exam) &&
        <DeleteExam exam={ examQuestion.exam! } onSubmit={ onExamDeleted }/>) }
    </div>

    { examQuestion === undefined ? <Spinner/> :
      <Progress value={ Math.floor(100 * (getQuestionNumber() + 1) / examQuestion.exam!.questionCount) }
                label="Steps"
                size="sm"
                className="mt-4"/> }

    { examQuestion === undefined ? <Spinner/> :
      <Progress value={ Math.floor(100 * examQuestion.exam!.answeredQuestionCount / examQuestion.exam!.questionCount) }
                label="Answered"
                size="lg"
                className="mt-4"/> }

    { examQuestion === undefined ? <Spinner/> :
      <Typography as="h2" variant="h6" className="mt-4">
        Question #{ getQuestionNumber() + 1 }: { examQuestion.question!.title }
      </Typography> }

    <div className="flex flex-col gap-8 mt-4">
      { examQuestion === undefined ? <Spinner/> : (
        examQuestion.question!.type === QuestionType.CHOICE
          ? examQuestion.question!.choices!.map((choice: QuestionChoice, index: number): ReactNode => (
            <Radio key={ `${ examQuestion.question!.id }-${ index }-${ examQuestion.choice }` }
                   name="choice"
                   defaultChecked={ index === examQuestion.choice }
                   onChange={ (): void => createAnswer(index) }
                   label={ choice.title }
                   disabled={ answering }/>
          ))
          : <Input type="text"
                   name="answer"
                   size="lg"
                   label="Answer"
                   onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => createAnswer(e.target.value) }
                   disabled={ answering }/>
      ) }
    </div>
  </>
}