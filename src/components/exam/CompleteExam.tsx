import { Card, CardBody, CardFooter, Dialog, Typography } from '@material-tailwind/react'
import { CheckIcon } from '@heroicons/react/24/solid'
import { memo, useState } from 'react'
import Exam from '../../schema/exam/Exam'
import { apiMutate } from '../../api/apolloClient'
import createExamCompletion from '../../api/exam/createExamCompletion'
import Error from '../Error'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'

interface Props {
  exam: Exam
  onSubmit?: (exam: Exam) => void
  iconButton?: boolean
}

const CompleteExam = ({ exam, onSubmit, iconButton }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    apiMutate(
      createExamCompletion(exam.id!),
      (data: { createExamCompletion: Exam }) => {
        setOpen(false)
        onSubmit && onSubmit(data.createExamCompletion)
      },
      setError,
      setProcessing,
    )
  }

  const icon = CheckIcon
  const label = processing ? 'Completing Exam...' : 'Complete Exam'

  return <>
    { iconButton
      ? <IconButton icon={ icon } tooltip={ label } onClick={ handleOpen } disabled={ processing }/>
      : <Button icon={ icon } label={ label } onClick={ handleOpen } disabled={ processing }/> }
    <Dialog open={ open } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            { `Are you sure you want to complete "${ exam.category!.name }" exam?` }
          </Typography>
          <Typography className="mb-3" variant="paragraph" color="gray">
            { `This will complete "${ exam.category!.name }" exam permanently.` }
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

export default memo(CompleteExam)