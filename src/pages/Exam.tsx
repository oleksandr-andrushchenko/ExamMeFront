import { Link, Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Input, Progress, Radio, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { ExclamationCircleIcon, HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import Exam from '../schema/exam/Exam'
import ExamPermission from '../enum/exam/ExamPermission'
import DeleteExam from '../components/exam/DeleteExam'
import ExamQuestion from '../schema/exam/ExamQuestion'
import { QuestionType } from '../schema/question/QuestionTransfer'
import CompleteExam from '../components/exam/CompleteExam'
import apolloClient, { apiQuery } from '../api/apolloClient'
import addExamQuestionAnswerMutation from '../api/exam/addExamQuestionAnswerMutation'
import examPageExamQuery from '../api/exam/examPageExamQuery'
import examPageExamQuestionQuery from '../api/exam/examPageExamQuestionQuery'

export default function Exam(): ReactNode {
  const { examId } = useParams<Params>() as { examId: string }
  const [ exam, setExam ] = useState<Exam>()
  const [ questionNumber, setQuestionNumber ] = useState<number>()
  const [ question, setQuestion ] = useState<ExamQuestion>()
  const [ answering, setAnswering ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const onPrevQuestionClick = () => setQuestionNumber(questionNumber - 1)
  const onNextQuestionClick = () => setQuestionNumber(questionNumber + 1)
  const onExamCompleted = () => navigate(Route.CATEGORY.replace(':categoryId', exam!.categoryId!), { replace: true })
  const onExamDeleted = () => navigate(Route.CATEGORY.replace(':categoryId', exam!.categoryId!), { replace: true })

  const hasPrevQuestion = (): boolean | undefined => {
    if (exam === undefined || question === undefined) {
      return undefined
    }

    return questionNumber > 0
  }
  const hasNextQuestion = (): boolean | undefined => {
    if (exam === undefined) {
      return undefined
    }

    return questionNumber < exam.questionCount - 1
  }
  const createAnswer = (answer: number | string) => {
    if (exam && question) {
      setAnswering(true)
      const transfer = question.type === QuestionType.CHOICE ? { choice: answer as number } : { answer: answer as string }

      apolloClient.mutate(addExamQuestionAnswerMutation(exam.id!, question.number, transfer))
        .then(({ data }: { data: { addExamQuestionAnswer: Exam } }) => setExam(data.addExamQuestionAnswer))
        .catch((err) => setError(err.message))
        .finally(() => setAnswering(false))
    }
  }

  useEffect((): void => {
    apiQuery<{ exam: Exam }>(
      examPageExamQuery(examId),
      (data): void => {
        setExam(data.exam)
        setQuestionNumber(data.exam.questionNumber)
        document.title = `Exam: ${ data.exam.category!.name || 'ExamMe' }`
      },
      setError,
      setLoading,
    )
  }, [])

  useEffect(() => {
    if (exam && questionNumber !== undefined) {
      apiQuery<{ examQuestion: ExamQuestion }>(
        examPageExamQuestionQuery(exam.id!, questionNumber),
        (data): void => setQuestion(data.examQuestion),
        setError,
        setLoading,
      )
    }
  }, [ questionNumber ])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { exam === undefined ? <Spinner/> :
        <Link to={ Route.CATEGORY.replace(':categoryId', exam.categoryId!) }>{ exam.category!.name }</Link> }
      <Link to={ Route.EXAM.replace(':examId', examId) }>Exam</Link>
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">Exam: { exam === undefined ?
      <Spinner/> : exam.category!.name }</Typography>

    <Typography variant="small" className="mt-1">Exam questions</Typography>

    { error && <Typography
      variant="small"
      color="red"
      className="flex items-center gap-1 font-normal">
      <ExclamationCircleIcon className="w-1/12"/>
      <span className="w-11/12">{ error }</span>
    </Typography> }

    <div className="flex gap-1 items-center mt-4">
      <Button variant="outlined" onClick={ onPrevQuestionClick }
              disabled={ answering || !hasPrevQuestion() }>Prev</Button>
      <Button variant="outlined" onClick={ onNextQuestionClick }
              disabled={ answering || !hasNextQuestion() }>Next</Button>

      { exam === undefined ? <Spinner/> : (checkAuth(ExamPermission.CREATE_COMPLETION, exam) &&
        <CompleteExam exam={ exam } onSubmit={ onExamCompleted }/>) }

      { exam === undefined ? <Spinner/> : (checkAuth(ExamPermission.DELETE, exam) &&
        <DeleteExam exam={ exam } onSubmit={ onExamDeleted }/>) }
    </div>

    { exam === undefined ? <Spinner/> :
      <Progress value={ Math.floor(100 * (questionNumber + 1) / exam.questionCount) }
                label="Steps"
                size="sm"
                className="mt-4"/> }

    { exam === undefined ? <Spinner/> :
      <Progress value={ Math.floor(100 * exam.answeredQuestionCount / exam.questionCount) }
                label="Answered"
                size="lg"
                className="mt-4"/> }

    { questionNumber === undefined || question === undefined ? <Spinner/> :
      <Typography as="h2" variant="h6" className="mt-4">
        Question #{ questionNumber + 1 }: { question.question }
      </Typography> }

    <div className="flex flex-col gap-8 mt-4">
      { question === undefined ? <Spinner/> : (
        question.choices
          ? question.choices.map((choice: string, index: number): ReactNode => (
            <Radio key={ `${ questionNumber }-${ question.choice }-${ index }` }
                   name="choice"
                   defaultChecked={ index === question.choice }
                   onChange={ (): void => createAnswer(index) }
                   label={ choice }
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