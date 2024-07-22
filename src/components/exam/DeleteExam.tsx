import { memo } from 'react'
import Exam from '../../schema/exam/Exam'
import deleteExam from '../../api/exam/deleteExam'
import { DeleteIcon } from '../../registry/icons'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface Props {
  exam: Exam
  onSubmit?: Function
  iconButton?: boolean
}

const DeleteExam = ({ exam, onSubmit, iconButton }: Props) => {
  return (
    <ConfirmDialog
      mutateOptionsFn={ () => deleteExam(exam.id!) }
      iconFn={ DeleteIcon }
      labelFn={ (isSubmitting) => isSubmitting ? 'Deleting Exam...' : 'Delete Exam' }
      title={ `Are you sure you want to delete "${ exam.category!.name }" exam?` }
      body={ <>This will delete "{ exam.category!.name }" exam permanently.<br/>You cannot undo this action.</> }
      onSubmit={ onSubmit }
      iconButton={ iconButton }
    />
  )
}

export default memo(DeleteExam)