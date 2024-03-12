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
      { category === undefined ? <Spinner/> : <Link to={ Route.CATEGORY.replace(':categoryId', category.id) }
                                                    className="capitalize">{ category.name }</Link> }
      { question === undefined ? <Spinner/> : <Link to={ Route.QUESTION.replace(':questionId', question.id) }
                                                    className="capitalize">{ question.title }</Link> }
    </Breadcrumbs>
    <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">
      <CubeIcon className="inline-block h-8 w-8 mr-1"/>
      <span className="capitalize">
          { question === undefined ? <Spinner/> : question.title }
        </span>
    </Typography>

    { category === undefined || question === undefined ? <Spinner/> : <div>
      <ListItem>
        <Typography variant="h6" color="blue-gray" className="inline-block">{ category.name }</Typography>
        <Chip color="blue" value="Category" className="inline-block ml-1"/>
      </ListItem>
      <ListItem>
        <Typography variant="h6" color="blue-gray" className="inline-block">{ question.title }</Typography>
        <Chip color="blue" value="Title" className="inline-block ml-1"/>
      </ListItem>
      <ListItem>
        <Typography variant="h6" color="blue-gray" className="inline-block">{ question.type }</Typography>
        <Chip color="blue" value="Type" className="inline-block ml-1"/>
      </ListItem>
      <ListItem>
        { question.type === QuestionType.TYPE && <div>
          { question.answers?.map((answer: QuestionAnswer) => {
            return <div>
              <div>{ answer.variants.join(', ') }</div>
              <div>{ answer.explanation }</div>
              <div>{ answer.correct }</div>
            </div>
          }) }
          <Chip color="blue" value="Answers" className="inline-block ml-1"/>
        </div> }
        { question.type === QuestionType.CHOICE && <div>
          { question.choices?.map((choice: QuestionChoice) => {
            return <div>
              <div>{ choice.title }</div>
              <div>{ choice.explanation }</div>
              <div>{ choice.correct }</div>
            </div>
          }) }
          <Chip color="blue" value="Choices" className="inline-block ml-1"/>
        </div> }
      </ListItem>
      <ListItem>
        <Typography variant="h6" color="blue-gray" className="inline-block">{ question.difficulty }</Typography>
        <Chip color="blue" value="Difficulty" className="inline-block ml-1"/>
      </ListItem>
    </div> }

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_QUESTION) &&
      (question === undefined ? <Spinner/> : <DeleteQuestion question={ question }/>) }
  </>
}