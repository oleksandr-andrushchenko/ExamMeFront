import { Link, Params, useParams } from 'react-router-dom'
import { Breadcrumbs, Chip, ListItem, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import Category from '../schema/Category'
import Question from '../schema/Question'
import getCategory from '../api/category/getCategory'
import getQuestion from '../api/question/getQuestion'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { QuestionAnswer, QuestionChoice, QuestionType } from '../schema/QuestionTransfer'
import AddQuestion from '../components/question/AddQuestion'

interface Data {
  category: Category | undefined,
  question: Question | undefined,
}

export default (): ReactNode => {
  const { categoryId, questionId } = useParams<Params>() as { categoryId: string, questionId: string }
  const [ { category, question }, setData ] = useState<Data>({ category: undefined, question: undefined })
  const { auth, me, checkAuth } = useAuth()

  useEffect((): void => {
    Promise.all<any>([ getCategory(categoryId), getQuestion(questionId) ])
      .then(([ category, question ]): void => setData({ category, question }))
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon
        className="inline-block w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { category === undefined ? <Spinner/> :
        <Link to={ Route.CATEGORY.replace(':categoryId', category.id) }>{ category.name }</Link> }
      { question === undefined ? <Spinner/> :
        <Link to={ Route.QUESTION.replace(':questionId', question.id) }>{ question.title }</Link> }
    </Breadcrumbs>

    <Typography variant="h1" className="mt-1">{ question === undefined ?
      <Spinner/> : question.title }</Typography>

    <Typography variant="small" className="mt-1">
      Question info
    </Typography>

    <div className="flex gap-1 items-center mt-4">
      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_QUESTION) &&
        (question === undefined ? <Spinner/> :
          <AddQuestion question={ question }
                       onSubmit={ (question: Question): void => setData({ category, question }) }/>) }

      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_QUESTION) &&
        (question === undefined ? <Spinner/> : <DeleteQuestion question={ question }/>) }
    </div>

    { category === undefined || question === undefined ? <Spinner/> : <div>
      <ListItem>
        <Chip variant="ghost" value="Title"/>
        <Typography variant="h6">{ question.title }</Typography>
      </ListItem>
      <ListItem>
        <Chip variant="ghost" value="Category"/>
        <Typography variant="h6">{ category.name }</Typography>
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