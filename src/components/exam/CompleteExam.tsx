import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { CheckIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import Route from '../../enum/Route'
import { useNavigate } from 'react-router-dom'
import normalizeApiErrors from '../../utils/normalizeApiErrors'
import Exam from '../../schema/exam/Exam'
import Category from '../../schema/category/Category'
import getCategory from '../../api/category/getCategory'
import Spinner from '../Spinner'
import createExamCompletion from '../../api/exam/createExamCompletion'

interface Props {
  exam: Exam
  onSubmit?: () => void
  iconButton?: boolean
}

export default ({ exam, onSubmit, iconButton }: Props): ReactNode => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ category, setCategory ] = useState<Category | undefined>(undefined)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  useEffect((): void => {
    if (open && category === undefined) {
      getCategory(exam.categoryId).then((category: Category): void => setCategory(category))
    }
  }, [ open ])

  useEffect((): void => {
    if (processing) {
      createExamCompletion(exam.id)
        .then((): void => {
          navigate(Route.CATEGORY.replace(':categoryId', exam.categoryId), { replace: true })
          onSubmit && onSubmit()
        })
        .catch((error): void => {
          const errors = normalizeApiErrors(error)
          console.log(errors)
          setError(errors?.unknown || '')
        })
        .finally((): void => setProcessing(false))
    }
  }, [ processing ])

  return <>
    { iconButton
      ? <Tooltip content="Complete exam">
        <IconButton
          onClick={ handleOpen }
          disabled={ processing }>
          <CheckIcon className="h-4 w-4"/>
        </IconButton>
      </Tooltip>
      : <Button
        onClick={ handleOpen }
        disabled={ processing }>
        <CheckIcon className="inline-block h-4 w-4"/> { processing ? 'Completing Exam...' : 'Complete Exam' }
      </Button> }
    <Dialog open={ open } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            { category === undefined ? <Spinner/> : `Are you sure you want to complete "${ category.name }" exam?` }
          </Typography>
          <Typography
            className="mb-3"
            variant="paragraph"
            color="gray">
            { category === undefined ? <Spinner/> : `This will complete "${ category.name }" exam permanently.` }
            <br/>
            You cannot undo this action.
          </Typography>
          { error && <Typography color="red">
            <ExclamationCircleIcon className="inline-block h-5 w-5"/> { error }
          </Typography> }
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            onClick={ handleOpen }>
            Cancel
          </Button>
          <Button
            size="md"
            className="ml-1"
            onClick={ () => setProcessing(true) }
            disabled={ processing }>
            <CheckIcon className="inline-block h-4 w-4"/> { processing ? 'Completing...' : 'Complete' }
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}