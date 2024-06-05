import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import Exam from '../../schema/exam/Exam'
import { apiMutate } from '../../api/apolloClient'
import completeExamMutation from '../../api/exam/completeExamMutation'
import Error from '../Error'

interface Props {
  exam: Exam
  onSubmit?: (exam: Exam) => void
  iconButton?: boolean
}

export default function CompleteExam({ exam, onSubmit, iconButton }: Props) {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    apiMutate<{ completeExam: Exam }>(
      completeExamMutation(exam.id!),
      data => {
        setOpen(false)
        onSubmit && onSubmit(data.completeExam)
      },
      setError,
      setProcessing,
    )
  }

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
            { `Are you sure you want to complete "${ exam.category!.name }" exam?` }
          </Typography>
          <Typography
            className="mb-3"
            variant="paragraph"
            color="gray">
            { `This will complete "${ exam.category!.name }" exam permanently.` }
            <br/>
            You cannot undo this action.
          </Typography>

          { error && <Error text={ error } simple/> }
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            onClick={ handleOpen }>
            Cancel
          </Button>
          <Button
            size="md"
            className="ml-1"
            onClick={ onClick }
            disabled={ processing }>
            <CheckIcon className="inline-block h-4 w-4"/> { processing ? 'Completing...' : 'Complete' }
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}