import { Link, Params, useParams } from 'react-router-dom'
import {
  Breadcrumbs,
  Button,
  IconButton,
  Input,
  Option,
  Select,
  Tab,
  Tabs,
  TabsHeader,
  Typography,
} from '@material-tailwind/react'
import Route from '../enum/Route'
import { HomeIcon } from '@heroicons/react/24/solid'
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
import AddCategory from '../components/category/AddCategory'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { QuestionDifficulty, QuestionType } from '../schema/QuestionTransfer.ts'

interface Data {
  category: Category | undefined,
  questions: Question[] | undefined,
}

export default (): ReactNode => {
  const { categoryId } = useParams<Params>() as { categoryId: string }
  const [ { category, questions }, setData ] = useState<Data>({ category: undefined, questions: undefined })
  const { auth, me, checkAuth } = useAuth()

  const refresh = (): void => {
    Promise.all<any>([ getCategory(categoryId), getCategoryQuestions(categoryId) ])
      .then(([ category, questions ]): void => setData({ category, questions }))
  }

  useEffect(refresh, [])

  const tableFilters = category === undefined ? [] : [
    {
      label: <Link to={ Route.CATEGORY.replace(':categoryId', category.id) }>All</Link>,
      value: 'all',
    },
    {
      label: <Link to={ `${ Route.CATEGORY.replace(':categoryId', category.id) }?free=1` }>Free</Link>,
      value: 'free',
    },
    {
      label: <Link to={ `${ Route.CATEGORY.replace(':categoryId', category.id) }?premium=1` }>Premium</Link>,
      value: 'premium',
    },
  ]

  const tableColumns = [ '#', 'Title', 'Difficulty', 'Type', '' ]

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon
        className="inline-block w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { category === undefined ? <Spinner/> :
        <Link to={ Route.CATEGORY.replace(':categoryId', category.id) }>{ category.name }</Link> }
    </Breadcrumbs>

    <Typography variant="h1" className="flex items-baseline mt-1">{ category === undefined ?
      <Spinner/> : category.name }</Typography>

    <Typography variant="small" className="mt-1">
      Available questions
    </Typography>

    <div className="flex gap-1 items-center mt-4">
      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_QUESTION) && (category === undefined ?
        <Spinner/> : <AddQuestion category={ category }/>) }

      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_CATEGORY) &&
        (category === undefined ? <Spinner/> :
          <AddCategory category={ category }
                       onSubmit={ (category: Category): void => setData({ category, questions }) }/>) }

      { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_CATEGORY) &&
        (category === undefined ? <Spinner/> : <DeleteCategory category={ category }/>) }
    </div>

    <div className="flex gap-1 items-center mt-4">
      <Tabs value="all" className="w-full md:w-max">
        <TabsHeader>
          { tableFilters.map(({ label, value }) => <Tab key={ value } value={ value }
                                                        className="text-xs small text-small">{ label }</Tab>) }
        </TabsHeader>
      </Tabs>

      <div>
        <Select
          label="Difficulty"
          onChange={ () => {
          } }
          value={ '' }>
          <Option key="" value="">All</Option>
          { Object.values(QuestionDifficulty)
            .map((type): ReactNode => <Option key={ type } value={ type } className="capitalize">{ type }</Option>) }
        </Select>
      </div>

      <div>
        <Select
          label="Type"
          onChange={ () => {
          } }
          value={ '' }>
          <Option key="" value="">All</Option>
          { Object.values(QuestionType)
            .map((type): ReactNode => <Option key={ type } value={ type } className="capitalize">{ type }</Option>) }
        </Select>
      </div>

      <div>
        <Input
          label="Search"
          icon={ <MagnifyingGlassIcon className="h-4 w-4"/> }
        />
      </div>
    </div>

    <table className="w-full table-auto text-left mt-4">
      <thead>
      <tr>
        { tableColumns.map((head) => (
          <th
            key={ head }
            className="bg-blue-gray-50/50 py-2 px-4">
            <Typography
              variant="small"
              className="opacity-70">
              { head }
            </Typography>
          </th>
        )) }
      </tr>
      </thead>
      { questions === undefined ? <Spinner/> : <tbody>
      { questions
        ? questions.map((question: Question, index: number): ReactNode => <tr key={ index }
                                                                              className={ index === 0 ? 'border-b' : '' }>
          <td className="py-2 px-4">
            <Typography variant="small">
              { index + 1 }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Typography variant="small">
              <Link
                key={ question.id }
                to={ Route.QUESTION.replace(':categoryId', question.category).replace(':questionId', question.id) }>
                { question.title }
              </Link>
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Typography variant="small" className="capitalize">
              { question.difficulty }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <Typography variant="small" className="capitalize">
              { question.type }
            </Typography>
          </td>

          <td className="py-2 px-4">
            <div className="flex justify-end gap-1">
              { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_QUESTION) &&
                <AddQuestion question={ question } onSubmit={ refresh } iconButton/> }

              { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_QUESTION) &&
                <DeleteQuestion question={ question } onSubmit={ refresh } iconButton/> }
            </div>
          </td>
        </tr>)
        : <tr>
          <td colSpan={ tableColumns.length } className="p-5 text-center">No data</td>
        </tr> }
      </tbody> }
    </table>

    { questions === undefined ? <Spinner/> : (questions && <div className="flex gap-1 mt-4">
      <Button variant="outlined">Previous</Button>
      <div className="flex items-center gap-2">
        <IconButton variant="outlined">1</IconButton>
        <IconButton variant="text">2</IconButton>
        <IconButton variant="text">3</IconButton>
        <IconButton variant="text">...</IconButton>
        <IconButton variant="text">8</IconButton>
        <IconButton variant="text">9</IconButton>
        <IconButton variant="text">10</IconButton>
      </div>
      <Button variant="outlined">Next</Button>
    </div>) }
  </>
}