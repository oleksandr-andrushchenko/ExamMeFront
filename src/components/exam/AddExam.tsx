import { Button, IconButton, Tooltip } from '@material-tailwind/react'
import { PlayIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Route from '../../enum/Route'
import Category from '../../schema/category/Category'
import Exam from '../../schema/exam/Exam'
import ExamTransfer from '../../schema/exam/ExamTransfer'
import useAuth from '../../hooks/useAuth'
import Spinner from '../Spinner'
import Auth from '../Auth'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import createExamMutation from '../../api/exam/createExamMutation'
import oneNonCompletedCategoryExamsQuery from '../../api/exam/oneNonCompletedCategoryExamsQuery'
import Error from '../Error'

interface Props {
  category: Category
  iconButton?: boolean
}

const AddExam = ({ category, iconButton }: Props) => {
  const { auth } = useAuth()
  const [ exam, setExam ] = useState<Exam>()
  const [ showAuth, setShowAuth ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const [ _, setLoading ] = useState<boolean>(true)
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
      navigate(Route.EXAM.replace(':categoryId', category.id!).replace(':examId', exam.id!))
    }

    apiMutate<{ createExam: Exam }>(
      createExamMutation(transfer),
      data => callback(data.createExam),
      setError,
      setProcessing,
    )
  }

  useEffect(() => {
    if (auth) {
      apiQuery<{ exams: Exam[] }>(
        oneNonCompletedCategoryExamsQuery(category.id!),
        data => setExam(data.exams[0] || null),
        setError,
        setLoading,
      )
    }
  }, [ auth ])

  if (auth && exam === undefined) {
    return <Spinner type={ iconButton ? 'icon-button' : 'button' }/>
  }

  const icon = <PlayIcon className="inline-block h-4 w-4"/>

  if (auth && exam) {
    const url = Route.EXAM.replace(':categoryId', exam.categoryId!).replace(':examId', exam.id!)
    const label = 'Continue exam'

    if (iconButton) {
      return (
        <Tooltip content={ label }>
          <Link to={ url }>
            <IconButton color="orange">{ icon }</IconButton>
          </Link>
        </Tooltip>
      )
    }

    return (
      <Link to={ url }>
        <Button color="orange">{ icon } { label }</Button>
      </Link>
    )
  }

  const label = 'Start exam'
  const disabled = processing || showAuth

  return <>
    { error && <Error text={ error }/> }

    { showAuth && <Auth dialogOnly onClose={ () => setShowAuth(false) }/> }

    { iconButton
      ? <Tooltip content={ label }>
        <IconButton color="green" onClick={ onClick } disabled={ disabled }>{ icon }</IconButton>
      </Tooltip>
      : <Button color="green" onClick={ onClick } disabled={ disabled }>{ icon } { label }</Button> }
  </>
}

export default memo(AddExam)