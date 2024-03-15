import { Link, Params, useParams } from 'react-router-dom'
import { Breadcrumbs, Chip, List, ListItem, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { CubeIcon, HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import Category from '../schema/Category'
import Question from '../schema/Question'
import getCategory from '../api/category/getCategory'
import getCategoryQuestions from '../api/question/getCategoryQuestions'
import DeleteCategory from '../components/category/DeleteCategory'
import AddQuestion from '../components/question/AddQuestion'
import AddCategory from '../components/category/AddCategory.tsx'

interface Data {
  category: Category | undefined,
  questions: Question[] | undefined,
}

export default (): ReactNode => {
  const { categoryId } = useParams<Params>() as { categoryId: string }
  const [ { category, questions }, setData ] = useState<Data>({ category: undefined, questions: undefined })
  const { auth, me, checkAuth } = useAuth()

  useEffect((): void => {
    Promise.all<any>([ getCategory(categoryId), getCategoryQuestions(categoryId) ])
      .then(([ category, questions ]): void => setData({ category, questions }))
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon
        className="inline-block w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { category === undefined ? <Spinner/> : <Link to={ Route.CATEGORY.replace(':categoryId', category.id) }
                                                    className="capitalize">{ category.name }</Link> }
    </Breadcrumbs>
    <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">
      <CubeIcon className="inline-block h-8 w-8 mr-1"/>
      <span className="capitalize">
          { category === undefined ? <Spinner/> : category.name }
        </span>
    </Typography>
    <Typography variant="small" color="gray" className="mt-1 font-normal">
      Available questions
    </Typography>

    { questions === undefined ? <Spinner/> : <List>
      { questions.map((question: Question, index: number) => <ListItem key={ question.id }>
        <Link
          key={ question.id }
          to={ Route.QUESTION.replace(':categoryId', question.category).replace(':questionId', question.id) }>
          <Chip
            variant="ghost"
            value={ index + 1 }
            className="rounded-full inline-block"
          /> { question.title }
        </Link>
      </ListItem>) }
    </List> }

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_QUESTION) && <AddQuestion/> }

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_CATEGORY) &&
      (category === undefined ? <Spinner/> :
        <AddCategory category={ category }
                     onSubmit={ (category: Category): void => setData({ category, questions }) }/>) }

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_CATEGORY) &&
      (category === undefined ? <Spinner/> : <DeleteCategory category={ category }/>) }
  </>
}