import { PlayIcon } from '@heroicons/react/24/solid'
import { ComponentProps, memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Route from '../../enum/Route'
import Category from '../../schema/category/Category'
import Exam from '../../schema/exam/Exam'
import useAuth from '../../hooks/useAuth'
import { apiMutate } from '../../api/apolloClient'
import createExam from '../../api/exam/createExam'
import Error from '../Error'
import Link from '../elements/Link'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import Auth from '../Auth'

interface Props extends ComponentProps<any> {
  category: Category
  iconButton?: boolean
}

const AddExam = ({ category, iconButton = false }: Props) => {
  const { authenticationToken } = useAuth()
  const [ processing, setProcessing ] = useState<boolean>(false)
  const [ create, setCreate ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

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
  const color = 'indigo'

  if (!authenticationToken) {
    return <Auth
      button={ { icon, label, size: 'sm', iconOnly: iconButton!, color } }
      dialog={ { label: 'You need to be authenticated' } }
      onSubmit={ onClick }
    />
  }

  if (category.examId) {
    const url = Route.Exam.replace(':categoryId', category.id!).replace(':examId', category.examId)
    const label = 'Continue exam'
    const color = 'blue'

    if (iconButton) {
      return <Link to={ url } label={ <IconButton icon={ icon } color={ color }/> } tooltip={ label }/>
    }

    return <Link to={ url } label={ <Button icon={ icon } label={ label } color={ color }/> }/>
  }

  return <>
    { error && <Error text={ error }/> }

    { iconButton
      ? <IconButton icon={ icon } tooltip={ label } color={ color } onClick={ onClick } disabled={ processing }/>
      : <Button icon={ icon } label={ label } color={ color } onClick={ onClick } disabled={ processing }/> }
  </>
}

export default memo(AddExam)