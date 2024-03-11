import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import Route from '../../enum/Route.ts'
import { useNavigate } from 'react-router-dom'
import normalizeApiErrors from '../../utils/normalizeApiErrors.ts'
import Question from '../../schema/Question.ts'
import deleteQuestion from '../../api/question/deleteQuestion.ts'

interface Props {
  question: Question,
}

export default ({ question }: Props) => {
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
      className="rounded capitalize font-normal"
      onClick={ handleOpen }
      disabled={ processing }>
      <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting Question...' : 'Delete Question' }
    </Button>
    <Dialog size="sm" open={ open } handler={ handleOpen }>
      <DialogHeader>
        <Typography variant="h4" color="blue-gray">
          Are you sure you want to delete "{ question.title }" question?
        </Typography>
      </DialogHeader>
      <DialogBody divider>
        <Typography className="font-normal">
          This will delete "{ question.title }" <b>question</b> permanently.
          <br/>
          You cannot undo this action.
        </Typography>

        { error && <Typography
          color="red"
          className="flex items-center gap-1">
          <ExclamationCircleIcon className="inline-block h-5 w-5"/> { error }
        </Typography> }
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button
          size="sm"
          className="rounded capitalize font-normal"
          onClick={ handleOpen }>
          Cancel
        </Button>

        <Button
          size="md"
          color="red"
          className="rounded capitalize font-normal"
          onClick={ () => setProcessing(true) }
          disabled={ processing }>
          <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting...' : 'Delete' }
        </Button>
      </DialogFooter>
    </Dialog>
  </>
}