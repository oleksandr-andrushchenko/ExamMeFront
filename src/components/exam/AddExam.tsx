import { Button, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, PlayIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Route from '../../enum/Route'
import Category from '../../schema/category/Category'
import Exam from '../../schema/exam/Exam'
import ExamTransfer from '../../schema/exam/ExamTransfer'
import useAuth from '../../hooks/useAuth'
import Spinner from '../Spinner'
import Auth from '../Auth'
import Question from '../../schema/question/Question'
import apolloClient from '../../api/apolloClient'
import addExamMutation from '../../api/exam/addExamMutation'
import addExamExamsQuery from '../../api/exam/addExamExamsQuery'

interface Props {
  category: Category
  iconButton?: boolean
}

export default function AddExam({ category, iconButton }: Props): ReactNode {
  const { auth } = useAuth()
  const [ exam, setExam ] = useState<Exam>()
  const [ showAuth, setShowAuth ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  const onClick = async (): Promise<void> => {
    if (!auth) {
      return setShowAuth(true)
    }

    setProcessing(true)

    const transfer: ExamTransfer = {
      categoryId: category.id!,
    }
    const callback = (exam: Exam) => {
      navigate(Route.EXAM.replace(':categoryId', exam.categoryId!).replace(':examId', exam.id!))
    }

    apolloClient.mutate(addExamMutation(transfer))
      .then(({ data }: { data: { addExam: Question } }) => callback(data.addExam))
      .catch((err) => setError(err.message))
      .finally(() => setProcessing(false))
  }

  useEffect(() => {
    if (auth) {
      setLoading(true)
      apolloClient.query(addExamExamsQuery(category.id!))
        .then(({ data }: { data: { exams: Question } }) => setExam(data.exams[0] || null))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [ auth ])

  if (auth && exam === undefined) {
    return <Spinner/>
  }

  if (auth && exam) {
    const url = Route.EXAM.replace(':categoryId', exam.categoryId!).replace(':examId', exam.id!)
    const label = 'Continue exam'

    if (iconButton) {
      return <Tooltip content={ label }>
        <Link to={ url }>
          <IconButton color="orange">
            <PlayIcon className="h-4 w-4"/>
          </IconButton>
        </Link>
      </Tooltip>
    }

    return <Link to={ url }>
      <Button color="orange">
        <PlayIcon className="inline-block h-4 w-4"/> { label }
      </Button>
    </Link>
  }

  const label = 'Start exam'
  const processingLabel = 'Starting exam...'
  const disabled = processing || showAuth

  return <>
    { error && <Typography
      variant="small"
      color="red"
      className="flex items-center gap-1 font-normal">
      <ExclamationCircleIcon className="w-1/12"/>
      <span className="w-11/12">{ error }</span>
    </Typography> }

    { showAuth && <Auth dialogOnly onClose={ () => setShowAuth(false) }/> }

    { iconButton
      ? <Tooltip content={ processing ? processingLabel : label }>
        <IconButton color="green" onClick={ onClick } disabled={ disabled }>
          <PlayIcon className="h-4 w-4"/>
        </IconButton>
      </Tooltip>
      : <Button color="green" onClick={ onClick } disabled={ disabled }>
        <PlayIcon className="inline-block h-4 w-4"/> { processing ? processingLabel : label }
      </Button> }
  </>
}