import { PlayIcon } from '@heroicons/react/24/solid'
import { ComponentProps, memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Route from '../../enum/Route'
import Category from '../../schema/category/Category'
import Exam from '../../schema/exam/Exam'
import useAuth from '../../hooks/useAuth'
import Spinner from '../Spinner'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import createExam from '../../api/exam/createExam'
import Error from '../Error'
import Link from '../elements/Link'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import Auth from '../Auth'
import getCurrentExams from '../../api/exam/getCurrentExams'

interface Props extends ComponentProps<any> {
  category: Category
  exam?: Exam
  iconButton?: boolean
}

const AddExam = ({ category, exam, iconButton }: Props) => {
  const { authenticationToken } = useAuth()
  const [ _exam, setExam ] = useState<Exam | undefined | null>(exam)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const [ create, setCreate ] = useState<boolean>(false)
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticationToken && _exam === undefined) {
      apiQuery<{ currentExams: Exam[] }>(
        getCurrentExams([ category.id! ]),
        data => setExam(data.currentExams[0] || null),
        setError,
        setLoading,
      )
    }
  }, [ authenticationToken, _exam ])

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
      button={ { icon, label, size: 'sm', iconOnly: iconButton, color } }
      dialog={ { label: 'You need to be authenticated' } }
      onSubmit={ onClick }
    />
  }

  if (authenticationToken && _exam === undefined) {
    return <Spinner type={ iconButton ? 'icon-button' : 'button' }/>
  }

  if (authenticationToken && _exam) {
    const url = Route.Exam.replace(':categoryId', _exam.categoryId!).replace(':examId', _exam.id!)
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