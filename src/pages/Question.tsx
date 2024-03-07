import { Link, Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { CubeIcon, HomeIcon, MinusIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import Category from '../schema/Category'
import Question from '../schema/Question'
import getCategory from '../api/getCategory'
import getQuestion from '../api/getQuestion'

interface Data {
  category: Category | undefined,
  question: Question | undefined,
}

export default (): ReactNode => {
  const { categoryId, questionId } = useParams<Params>() as { categoryId: string, questionId: string }
  const [ { category, question }, setData ] = useState<Data>({ category: undefined, question: undefined })
  const { auth, me, checkAuth } = useAuth()
  const navigate = useNavigate()

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

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_QUESTION) && <Button
      size="sm"
      className="rounded capitalize font-normal mt-3"
      onClick={ () => navigate(Route.CATEGORY.replace(':categoryId', categoryId), { replace: true }) }>
      <MinusIcon className="inline-block h-4 w-4"/> Remove Question
    </Button> }
  </>
}