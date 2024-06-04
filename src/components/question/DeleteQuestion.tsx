import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import Question from '../../schema/question/Question'
import { apiMutate } from '../../api/apolloClient'
import removeQuestionMutation from '../../api/question/removeQuestionMutation'
import Error from '../Error'

interface Props {
  question: Question
  onSubmit?: () => void
  iconButton?: boolean
}

export default function DeleteQuestion({ question, onSubmit, iconButton }: Props): ReactNode {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    apiMutate<{ removeQuestion: boolean }>(
      removeQuestionMutation(question.id!),
      (_): void => {
        setOpen(false)
        onSubmit && onSubmit()
      },
      setError,
      setProcessing,
    )
  }

  return <>
    {
      iconButton
        ? <Tooltip content="Delete question">
          <IconButton
            onClick={ handleOpen }
            disabled={ processing }>
            <XMarkIcon className="h-4 w-4"/>
          </IconButton>
        </Tooltip>
        : <Button
          onClick={ handleOpen }
          disabled={ processing }>
          <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting Question...' : 'Delete Question' }
        </Button>
    }
    <Dialog open={ open } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Are you sure you want to delete "{ question.title }" question?
          </Typography>
          <Typography
            className="mb-3"
            variant="paragraph"
            color="gray">
            This will delete "{ question.title }" question permanently.
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
            <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting...' : 'Delete' }
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}