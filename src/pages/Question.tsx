import { Link, Params, useParams } from 'react-router-dom'
import { Breadcrumbs, Chip, ListItem, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { ExclamationCircleIcon, HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import Question from '../schema/question/Question'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { QuestionAnswer, QuestionChoice, QuestionType } from '../schema/question/QuestionTransfer'
import AddQuestion from '../components/question/AddQuestion'
import Rating from '../components/Rating'
import { apiQuery } from '../api/apolloClient'
import questionPageQuestionQuery from '../api/question/questionPageQuestionQuery'

export default function Question(): ReactNode {
  const { questionId } = useParams<Params>() as { questionId: string }
  const [ question, setQuestion ] = useState<Question>()
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { auth, me, checkAuth } = useAuth()

  useEffect((): void => {
    apiQuery<{ question: Question }>(
      questionPageQuestionQuery(questionId),
      (data): void => setQuestion(data.question),
      setError,
      setLoading,
    )
  }, [])

  useEffect((): void => {
    document.title = question?.title || 'ExamMe'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { question === undefined ? <Spinner/> :
        <Link to={ Route.CATEGORY.replace(':categoryId', question.category!.id!) }>{ question.category!.name }</Link> }
      { question === undefined ? <Spinner/> :
        <Link to={ Route.QUESTION.replace(':questionId', question.id!) }>{ question.title }</Link> }
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">{ question === undefined ?
      <Spinner/> : question.title }</Typography>

    <Rating/>

    <Typography variant="small" className="mt-1">Question info</Typography>

    { error && <Typography
      variant="small"
      color="red"
      className="flex items-center gap-1 font-normal">
      <ExclamationCircleIcon className="w-1/12"/>
      <span className="w-11/12">{ error }</span>
    </Typography> }

    <div className="flex gap-1 items-center mt-4">
      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_QUESTION) &&
        (question === undefined ? <Spinner/> :
          <AddQuestion question={ question } onSubmit={ (question: Question): void => setQuestion(question) }/>) }

      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_QUESTION) &&
        (question === undefined ? <Spinner/> : <DeleteQuestion question={ question }/>) }
    </div>

    { question === undefined ? <Spinner/> : <div>
      <ListItem>
        <Chip variant="ghost" value="Title"/>
        <Typography variant="h6">{ question.title }</Typography>
      </ListItem>
      <ListItem>
        <Chip variant="ghost" value="Category"/>
        <Typography variant="h6">{ question.category!.name }</Typography>
      </ListItem>
      <ListItem>
        <Chip variant="ghost" value="Type"/>
        <Typography variant="h6">{ question.type }</Typography>
      </ListItem>
      <ListItem>
        { question.type === QuestionType.TYPE && <div>
          <Chip variant="ghost" value="Answers"/>
          { question.answers?.map((answer: QuestionAnswer, index: number): ReactNode => <div key={ index }>
            <Chip variant="ghost" value={ `Answer #${ index + 1 }` }/>
            <div><Chip variant="ghost" value="Variants"/> { answer.variants.join(', ') }</div>
            { answer.explanation && <div><Chip variant="ghost" value="Explanation"/> { answer.explanation }</div> }
            <div><Chip variant="ghost" value="Correct"/> { answer.correct ? 'Yes' : 'No' }</div>
          </div>) }
        </div> }
        { question.type === QuestionType.CHOICE && <div>
          <Chip variant="ghost" value="Choices"/>
          { question.choices?.map((choice: QuestionChoice, index: number): ReactNode => <div key={ index }>
            <Chip variant="ghost" value={ `Choice #${ index + 1 }` }/>
            <div><Chip variant="ghost" value="Title"/> { choice.title }</div>
            { choice.explanation && <div><Chip variant="ghost" value="Explanation"/> { choice.explanation }</div> }
            <div><Chip variant="ghost" value="Correct"/> { choice.correct ? 'Yes' : 'No' }</div>
          </div>) }
        </div> }
      </ListItem>
      <ListItem>
        <Chip variant="ghost" value="Difficulty"/>
        <Typography variant="h6">{ question.difficulty }</Typography>
      </ListItem>
    </div> }
  </>
}