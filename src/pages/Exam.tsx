import { Link, Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Input, Progress, Radio, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'
import Exam from '../schema/exam/Exam.ts'
import getExam from '../api/exam/getExam.ts'
import getCategory from '../api/category/getCategory.ts'
import Category from '../schema/category/Category.ts'
import ExamPermission from '../enum/exam/ExamPermission.ts'
import DeleteExam from '../components/exam/DeleteExam.tsx'
import getExamQuestion from '../api/exam/getExamQuestion.ts'
import ExamQuestion from '../schema/exam/ExamQuestion.ts'
import { QuestionType } from '../schema/question/QuestionTransfer.ts'
import createExamQuestionAnswer from '../api/exam/createExamQuestionAnswer.ts'
import CompleteExam from '../components/exam/CompleteExam.tsx'

export default (): ReactNode => {
  const { examId } = useParams<Params>() as { examId: string }
  const [ exam, setExam ] = useState<Exam | undefined>(undefined)
  const [ category, setCategory ] = useState<Category | undefined>(undefined)
  const [ questionNumber, setQuestionNumber ] = useState<number | undefined>(undefined)
  const [ question, setQuestion ] = useState<ExamQuestion | undefined>(undefined)
  const [ answering, setAnswering ] = useState<boolean>(false)
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const onDelete = (): void => exam && navigate(Route.CATEGORY.replace(':categoryId', exam.category), { replace: true })
  const hasPrevQuestion = (): boolean | undefined => {
    if (exam === undefined || question === undefined) {
      return undefined
    }

    return questionNumber > 0
  }
  const createAnswer = (answer: number | string) => {
    if (exam && question) {
      setAnswering(true)
      const transfer = question.type === QuestionType.CHOICE ? { choice: answer as number } : { answer: answer as string }
      createExamQuestionAnswer(exam.id, question.number, transfer)
        .finally(() => {
          getExam(examId).then((exam: Exam): void => setExam(exam)).finally(() => setAnswering(false))
        })
    }
  }
  const onPrevQuestionClick = () => setQuestionNumber(questionNumber - 1)
  const hasNextQuestion = (): boolean | undefined => {
    if (exam === undefined) {
      return undefined
    }

    return questionNumber < exam.questionsCount - 1
  }
  const onNextQuestionClick = () => setQuestionNumber(questionNumber + 1)
  const onCompleteClick = () => {

  }

  useEffect((): void => {
    getExam(examId).then((exam: Exam): void => {
      setExam(exam)
      getCategory(exam.category).then((category: Category): void => {
        setCategory(category)
        document.title = `Exam: ${ category.name || 'ExamMe' }`
      })
      setQuestionNumber(exam.questionNumber)
    })
  }, [])

  useEffect(() => {
    if (exam && questionNumber !== undefined) {
      getExamQuestion(exam.id, questionNumber).then((question: ExamQuestion): void => setQuestion(question))
    }
  }, [ questionNumber ])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { category === undefined ? <Spinner/> :
        <Link to={ Route.CATEGORY.replace(':categoryId', category.id) }>{ category.name }</Link> }
      <Link to={ Route.EXAM.replace(':examId', examId) }>Exam</Link>
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">Exam: { category === undefined ?
      <Spinner/> : category.name }</Typography>

    <Typography variant="small" className="mt-1">Exam questions</Typography>

    <div className="flex gap-1 items-center mt-4">
      <Button variant="outlined" onClick={ onPrevQuestionClick }
              disabled={ answering || !hasPrevQuestion() }>Prev</Button>
      <Button variant="outlined" onClick={ onNextQuestionClick }
              disabled={ answering || !hasNextQuestion() }>Next</Button>

      <CompleteExam exam={ exam } onSubmit={ onCompleteClick }/>

      { exam === undefined ? <Spinner/> : (checkAuth(ExamPermission.DELETE, exam) &&
        <DeleteExam exam={ exam } onSubmit={ onDelete }/>) }
    </div>

    { exam === undefined ? <Spinner/> :
      <Progress value={ Math.floor(100 * (questionNumber + 1) / exam.questionsCount) }
                label="Steps"
                size="sm"
                className="mt-4"/> }

    { exam === undefined ? <Spinner/> :
      <Progress value={ Math.floor(100 * exam.answeredCount / exam.questionsCount) }
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