import { Link, Params, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Checkbox, Input, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { HomeIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import Question from '../schema/question/Question'
import DeleteQuestion from '../components/question/DeleteQuestion'
import { QuestionChoice, QuestionType } from '../schema/question/QuestionTransfer'
import AddQuestion from '../components/question/AddQuestion'
import Rating from '../components/Rating'
import { apiQuery } from '../api/apolloClient'
import questionPageQuestionQuery from '../api/question/questionPageQuestionQuery'
import Error from '../components/Error'

export default function Question() {
  const { questionId } = useParams<Params>() as { questionId: string }
  const [ question, setQuestion ] = useState<Question>()
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { checkAuth } = useAuth()
  const navigate = useNavigate()

  const onQuestionUpdated = (question: Question) => setQuestion(question)
  const onQuestionDeleted = () => navigate(Route.CATEGORY.replace(':categoryId', question!.categoryId!), { replace: true })

  useEffect(() => {
    apiQuery<{ question: Question }>(
      questionPageQuestionQuery(questionId),
      data => setQuestion(data.question),
      setError,
      setLoading,
    )
  }, [])

  useEffect(() => {
    document.title = question?.title || 'ExamMe'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      { question === undefined ? <Spinner type="text"/> :
        <Link to={ Route.CATEGORY.replace(':categoryId', question.categoryId!) }>{ question.category!.name }</Link> }
      { question === undefined ? <Spinner type="text"/> :
        <Link to={ Route.QUESTION.replace(':questionId', question.id!) }>{ question.title }</Link> }
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">{ question === undefined ?
      <Spinner type="text"/> : question.title }</Typography>

    <Rating/>

    <Typography variant="small" className="mt-1">Question info</Typography>

    { error && <Error text={ error }/> }

    <div className="flex gap-1 items-center mt-4">
      { checkAuth(Permission.UPDATE_QUESTION, question) && (question === undefined ? <Spinner type="button"/> :
        <AddQuestion question={ question } onSubmit={ onQuestionUpdated }/>) }

      { checkAuth(Permission.DELETE_QUESTION, question) && (question === undefined ? <Spinner type="button"/> :
        <DeleteQuestion question={ question } onSubmit={ onQuestionDeleted }/>) }
    </div>

    <table className="w-full table-auto text-left text-sm capitalize mt-4">
      <tbody>
      <tr>
        <th>Title</th>
        <td>{ question ? question.title : <Spinner type="text"/> }</td>
      </tr>
      <tr>
        <th>Category</th>
        <td>{ question ? question.category!.name : <Spinner type="text"/> }</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>{ question ? question.type : <Spinner type="text"/> }</td>
      </tr>
      <tr>
        <th>
          { question === undefined ? <Spinner type="text"/> : (
            question.type === QuestionType.CHOICE ? 'Choices' : 'Answers'
          ) }
        </th>
        <td>
          { question === undefined ? <Spinner type="text"/> : (
            question.type === QuestionType.CHOICE
              ? question.choices!.map((choice: QuestionChoice, index) => (
                <Checkbox
                  key={ `${ question.id }-${ index }` }
                  name="choice"
                  label={ choice.title }
                  disabled={ true }/>
              ))
              : <Input
                type="text"
                name="answer"
                size="lg"
                label="Answer"
                disabled={ true }/>
          ) }
        </td>
      </tr>
      <tr>
        <th>Difficulty</th>
        <td>{ question ? question.difficulty : <Spinner type="text"/> }</td>
      </tr>
      </tbody>
    </table>
  </>
}