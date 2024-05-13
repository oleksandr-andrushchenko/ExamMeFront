import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import Route from '../../enum/Route'
import { useNavigate } from 'react-router-dom'
import Question from '../../schema/question/Question'
import apolloClient from '../../api/apolloClient'
import removeQuestionMutation from '../../api/question/removeQuestionMutation'

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
  const navigate = useNavigate()

  const onClick = () => {
    setProcessing(true)
    apolloClient.mutate(removeQuestionMutation(question.id!))
      .then(_ => {
        setOpen(false)
        navigate(Route.CATEGORY.replace(':categoryId', question.categoryId!), { replace: true })
        onSubmit && onSubmit()
      })
      .catch((err) => setError(err.message))
      .finally(() => setProcessing(false))
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
            onClick={ onClick }
            disabled={ processing }>
            <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting...' : 'Delete' }
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}