import { Button, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, PlayIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import normalizeApiErrors from '../../utils/normalizeApiErrors'
import Route from '../../enum/Route'
import Category from '../../schema/category/Category'
import Exam from '../../schema/exam/Exam'
import ExamTransfer from '../../schema/exam/ExamTransfer'
import createExam from '../../api/exam/createExam'
import useAuth from '../../hooks/useAuth'
import queryExams from '../../api/exam/queryExams'
import Paginated from '../../types/pagination/Paginated'
import Spinner from '../Spinner'
import Auth from '../Auth'

interface Props {
  category: Category
  iconButton?: boolean
}

export default ({ category, iconButton }: Props): ReactNode => {
  const { auth } = useAuth()
  const [ exam, setExam ] = useState<Exam | undefined>(undefined)
  const [ showAuth, setShowAuth ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  const onClick = async (): Promise<void> => {
    if (!auth) {
      return setShowAuth(true)
    }

    try {
      setProcessing(true)

      const transfer: ExamTransfer = {
        category: category.id,
      }
      const exam = await createExam(transfer)
      navigate(Route.EXAM.replace(':categoryId', exam.category).replace(':examId', exam.id))
    } catch (err) {
      const errors = normalizeApiErrors(err)
      console.log(errors)
      setError(errors?.unknown || '')
    } finally {
      setProcessing(false)
    }
  }

  useEffect(() => {
    if (auth) {
      const query = {
        category: category.id,
        completion: false,
        size: 1,
      }
      queryExams(query).then((exams: Paginated<Exam>): void => setExam(exams.data[0] || null))
    }
  }, [ auth ])

  if (auth && exam === undefined) {
    return <Spinner/>
  }

  if (auth && exam) {
    const url = Route.EXAM.replace(':categoryId', exam.category).replace(':examId', exam.id)
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