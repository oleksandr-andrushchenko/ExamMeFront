import { Link, useParams } from 'react-router-dom'
import {
  Breadcrumbs,
  Button,
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
import queryCategoryQuestions from '../api/question/queryCategoryQuestions'
import DeleteCategory from '../components/category/DeleteCategory'
import AddQuestion from '../components/question/AddQuestion'
import AddCategory from '../components/category/AddCategory'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { QuestionDifficulty, QuestionType } from '../schema/QuestionTransfer'
import Paginated from '../types/pagination/Paginated'
import Pagination from '../types/pagination/Pagination'

export default (): ReactNode => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const [ category, setCategory ] = useState<Category>()
  const [ questions, setQuestions ] = useState<Paginated<Question>>()
  const [ pagination, setPagination ] = useState<Pagination>({ size: 20 })
  const { auth, me, checkAuth } = useAuth()

  useEffect((): void => {
    getCategory(categoryId).then((category): void => setCategory(category))
  }, [ categoryId ])

  const refresh = (): void => {
    queryCategoryQuestions(categoryId, pagination).then((questions): void => setQuestions(questions))
  }
  const onPrevClick = (): void => {
    setQuestions(undefined)
    setPagination({
      ...pagination, ...{
        prevCursor: questions.meta.prevCursor,
        nextCursor: undefined,
      },
    })
  }
  const onNextClick = (): void => {
    setQuestions(undefined)
    setPagination({
      ...pagination, ...{
        prevCursor: undefined,
        nextCursor: questions.meta.nextCursor,
      },
    })
  }

  useEffect(refresh, [ pagination ])

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
                       onSubmit={ (category: Category): void => setCategory(category) }/>) }

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
        ? questions.data.map((question: Question, index: number): ReactNode => <tr key={ index }
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

    { questions === undefined ? <Spinner/> : ((questions.meta.prevCursor || questions.meta.nextCursor) &&
      <div className="flex gap-1 mt-4">
        { questions.meta.prevCursor && <Button variant="outlined" onClick={ onPrevClick }>Previous</Button> }
        { questions.meta.nextCursor && <Button variant="outlined" onClick={ onNextClick }>Next</Button> }
      </div>) }
  </>
}