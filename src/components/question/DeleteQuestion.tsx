import { Button, Card, CardBody, CardFooter, Dialog, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import Route from '../../enum/Route'
import { useNavigate } from 'react-router-dom'
import normalizeApiErrors from '../../utils/normalizeApiErrors'
import Question from '../../schema/Question'
import deleteQuestion from '../../api/question/deleteQuestion'

interface Props {
  question: Question,
}

export default ({ question }: Props): ReactNode => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    if (processing) {
      deleteQuestion(question.id)
        .then(() => navigate(Route.CATEGORY.replace(':categoryId', question.category), { replace: true }))
        .catch((error) => {
          const errors = normalizeApiErrors(error)
          console.log(errors)
          setError(errors?.unknown || '')
        })
        .finally(() => setProcessing(false))
    }
  }, [ processing ])

  return <>
    <Button
      size="sm"
      color="red"
      onClick={ handleOpen }
      disabled={ processing }>
      <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting Question...' : 'Delete Question' }
    </Button>
    <Dialog size="xs" open={ open } handler={ handleOpen } className="bg-transparent shadow-none">
      <Card className="mx-auto w-full max-w-[24rem] text-center">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Are you sure you want to delete "{ question.title }" question?
          </Typography>
          <Typography
            className="mb-3 font-normal"
            variant="paragraph"
            color="gray"
          >
            This will delete "{ question.title }" question permanently.
            <br/>
            You cannot undo this action.
          </Typography>
          { error && <Typography color="red">
            <ExclamationCircleIcon className="inline-block h-5 w-5"/> { error }
          </Typography> }
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            size="sm"
            onClick={ handleOpen }>
            Cancel
          </Button>
          <Button
            size="md"
            color="red"
            className="ml-1"
            onClick={ () => setProcessing(true) }
            disabled={ processing }>
            <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting...' : 'Delete' }
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}