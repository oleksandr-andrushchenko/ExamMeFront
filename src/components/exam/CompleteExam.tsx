import { CheckIcon } from '@heroicons/react/24/solid'
import { ComponentProps, memo } from 'react'
import Exam from '../../schema/exam/Exam'
import createExamCompletion from '../../api/exam/createExamCompletion'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface Props extends ComponentProps<any> {
  exam: Exam
  onSubmit?: Function
  iconButton?: boolean
}

const CompleteExam = ({ exam, onSubmit, iconButton }: Props) => {
  return (
    <ConfirmDialog
      mutateOptionsFn={ () => createExamCompletion(exam.id!) }
      iconFn={ CheckIcon }
      labelFn={ (isSubmitting) => isSubmitting ? 'Completing Exam...' : 'Complete Exam' }
      title={ `Are you sure you want to complete "${ exam.category!.name }" exam?` }
      body={ <>This will complete "{ exam.category!.name }" exam permanently.<br/>You cannot undo this action.</> }
      onSubmit={ onSubmit }
      iconButton={ iconButton }
    />
  )
}

export default memo(CompleteExam)