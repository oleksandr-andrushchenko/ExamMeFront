import { Card, CardBody, CardFooter, Dialog, Typography } from '@material-tailwind/react'
import { memo, useState } from 'react'
import Question from '../../schema/question/Question'
import { apiMutate } from '../../api/apolloClient'
import deleteQuestion from '../../api/question/deleteQuestion'
import Error from '../Error'
import { DeleteIcon } from '../../registry/icons'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'

interface Props {
  question: Question
  onSubmit?: () => void
  iconButton?: boolean
}

const DeleteQuestion = ({ question, onSubmit, iconButton }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    apiMutate(
      deleteQuestion(question.id!),
      (_) => {
        setOpen(false)
        onSubmit && onSubmit()
      },
      setError,
      setProcessing,
    )
  }

  const icon = DeleteIcon
  const label = processing ? 'Deleting Question...' : 'Delete Question'

  return <>
    { iconButton
      ? <IconButton icon={ icon } tooltip={ label } onClick={ handleOpen } disabled={ processing }/>
      : <Button icon={ icon } label={ label } onClick={ handleOpen } disabled={ processing }/> }
    <Dialog open={ open } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Are you sure you want to delete "{ question.title }" question?
          </Typography>
          <Typography className="mb-3" variant="paragraph" color="gray">
            This will delete "{ question.title }" question permanently.
            <br/>
            You cannot undo this action.
          </Typography>

          { error && <Error text={ error } simple/> }
        </CardBody>
        <CardFooter className="pt-0">
          <Button label="Cancel" onClick={ handleOpen }/>{ ' ' }
          <Button icon={ icon } label={ label } size="md" onClick={ onClick } disabled={ processing }/>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}

export default memo(DeleteQuestion)