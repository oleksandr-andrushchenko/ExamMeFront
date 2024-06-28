import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { memo, useState } from 'react'
import Exam from '../../schema/exam/Exam'
import { apiMutate } from '../../api/apolloClient'
import removeExamMutation from '../../api/exam/removeExamMutation'
import Error from '../Error'

interface Props {
  exam: Exam
  onSubmit?: () => void
  iconButton?: boolean
}

const DeleteExam = ({ exam, onSubmit, iconButton }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    apiMutate<{ removeExam: boolean }>(
      removeExamMutation(exam.id!),
      (_) => {
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
        ? <Tooltip content="Delete exam">
          <IconButton onClick={ handleOpen } disabled={ processing }>
            <XMarkIcon className="h-4 w-4"/>
          </IconButton>
        </Tooltip>
        : <Button onClick={ handleOpen } disabled={ processing }>
          <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting Exam...' : 'Delete Exam' }
        </Button>
    }
    <Dialog open={ open } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            { `Are you sure you want to delete "${ exam.category!.name }" exam?` }
          </Typography>
          <Typography className="mb-3" variant="paragraph" color="gray">
            { `This will delete "${ exam.category!.name }" exam permanently.` }
            <br/>
            You cannot undo this action.
          </Typography>

          { error && <Error text={ error } simple/> }
        </CardBody>
        <CardFooter className="pt-0">
          <Button onClick={ handleOpen }>
            Cancel
          </Button>
          <Button size="md" className="ml-1" onClick={ onClick } disabled={ processing }>
            <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting...' : 'Delete' }
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}

export default memo(DeleteExam)