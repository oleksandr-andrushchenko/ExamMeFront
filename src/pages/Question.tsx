import { Link, Params, useParams } from 'react-router-dom'
import { Breadcrumbs, Chip, ListItem, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { CubeIcon, HomeIcon } from '@heroicons/react/24/solid'
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
    <Typography variant="h1" color="blue-gray" className="truncate mt-1">
      <CubeIcon className="inline-block h-8 w-8 mr-1"/>
      { question === undefined ? <Spinner/> : question.title }
    </Typography>

    { category === undefined || question === undefined ? <Spinner/> : <div>
      <ListItem>
        <Typography variant="h6" color="blue-gray" className="inline-block">{ category.name }</Typography>
        <Chip variant="ghost" value="Category" className="inline-block ml-1"/>
      </ListItem>
      <ListItem>
        <Typography variant="h6" color="blue-gray" className="inline-block">{ question.title }</Typography>
        <Chip variant="ghost" value="Title" className="inline-block ml-1"/>
      </ListItem>
      <ListItem>
        <Typography variant="h6" color="blue-gray" className="inline-block">{ question.type }</Typography>
        <Chip variant="ghost" value="Type" className="inline-block ml-1"/>
      </ListItem>
      <ListItem>
        { question.type === QuestionType.TYPE && <div>
          { question.answers?.map((answer: QuestionAnswer): ReactNode => <div>
            <div>{ answer.variants.join(', ') }</div>
            <div>{ answer.explanation }</div>
            <div>{ answer.correct }</div>
          </div>) }
          <Chip variant="ghost" value="Answers" className="inline-block ml-1"/>
        </div> }
        { question.type === QuestionType.CHOICE && <div>
          { question.choices?.map((choice: QuestionChoice): ReactNode => <div>
            <div>{ choice.title }</div>
            <div>{ choice.explanation }</div>
            <div>{ choice.correct }</div>
          </div>) }
          <Chip variant="ghost" value="Choices" className="inline-block ml-1"/>
        </div> }
      </ListItem>
      <ListItem>
        <Typography variant="h6" color="blue-gray" className="inline-block">{ question.difficulty }</Typography>
        <Chip variant="ghost" value="Difficulty" className="inline-block ml-1"/>
      </ListItem>
    </div> }

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_QUESTION) &&
      (question === undefined ? <Spinner/> :
        <AddQuestion question={ question }
                     onSubmit={ (question: Question): void => setData({ category, question }) }/>) }

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_QUESTION) &&
      (question === undefined ? <Spinner/> : <DeleteQuestion question={ question }/>) }
  </>
}