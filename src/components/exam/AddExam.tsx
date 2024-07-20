import { PlayIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Route from '../../enum/Route'
import Category from '../../schema/category/Category'
import Exam from '../../schema/exam/Exam'
import useAuth from '../../hooks/useAuth'
import Spinner from '../Spinner'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import createExam from '../../api/exam/createExam'
import getOneNonCompletedCategoryExams from '../../api/exam/getOneNonCompletedCategoryExams'
import Error from '../Error'
import Link from '../elements/Link'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import Auth from '../Auth'

interface Props {
  category: Category
  iconButton?: boolean
}

const AddExam = ({ category, iconButton }: Props) => {
  const { authenticationToken } = useAuth()
  const [ exam, setExam ] = useState<Exam>()
  const [ processing, setProcessing ] = useState<boolean>(false)
  const [ create, setCreate ] = useState<boolean>(false)
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticationToken) {
      apiQuery<{ exams: Exam[] }>(
        getOneNonCompletedCategoryExams(category.id!),
        data => setExam(data.exams[0] || null),
        setError,
        setLoading,
      )
    }
  }, [ authenticationToken ])

  useEffect(() => {
    if (create) {
      apiMutate(
        createExam({ categoryId: category.id! }),
        (data: {
          createExam: Exam
        }) => navigate(Route.Exam.replace(':categoryId', category.id!).replace(':examId', data.createExam.id!)),
        setError,
        setProcessing,
      )
    }
  }, [ create ])

  const onClick = () => setCreate(true)

  const icon = PlayIcon
  const label = 'Start exam'
  const color = 'green'

  if (!authenticationToken) {
    return <Auth
      button={ { icon, label, size: 'sm', iconOnly: iconButton, color } }
      dialog={ { label: 'You need to be authenticated' } }
      onSubmit={ onClick }
    />
  }

  if (authenticationToken && exam === undefined) {
    return <Spinner type={ iconButton ? 'icon-button' : 'button' }/>
  }

  if (authenticationToken && exam) {
    const url = Route.Exam.replace(':categoryId', exam.categoryId!).replace(':examId', exam.id!)
    const label = 'Continue exam'

    if (iconButton) {
      return <Link to={ url } label={ <IconButton icon={ icon } color="orange"/> } tooltip={ label }/>
    }

    return <Link to={ url } label={ <Button icon={ icon } label={ label } color="orange"/> }/>
  }

  return <>
    { error && <Error text={ error }/> }

    { iconButton
      ? <IconButton icon={ icon } tooltip={ label } color={ color } onClick={ onClick } disabled={ processing }/>
      : <Button icon={ icon } label={ label } color={ color } onClick={ onClick } disabled={ processing }/> }
  </>
}

export default memo(AddExam)