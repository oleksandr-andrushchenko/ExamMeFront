import { memo } from 'react'
import Question from '../../schema/question/Question'
import { DisabledIcon, EnabledIcon } from '../../registry/icons'
import toggleQuestionApprove from '../../api/question/toggleQuestionApprove'
import isQuestionApproved from '../../services/questions/isQuestionApproved'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface Props {
  question: Question
  onSubmit?: Function
  iconButton?: boolean
}

const ApproveQuestion = ({ question, onSubmit, iconButton }: Props) => {
  const action = isQuestionApproved(question) ? 'Un-approve' : 'approve'

  return (
    <ConfirmDialog
      mutateOptionsFn={ () => toggleQuestionApprove(question.id!) }
      iconFn={ _ => isQuestionApproved(question) ? EnabledIcon : DisabledIcon }
      labelFn={ isSubmitting => isQuestionApproved(question) ? (isSubmitting ? 'Un-approving Question...' : 'Un-approve Question') : (isSubmitting ? 'Approving Question...' : 'Approve Question') }
      title={ `Are you sure you want to ${ action } "${ question.title }" question?` }
      body={ <>This will { action } "{ question.title }" question.<br/>It will effect question visibility.</> }
      onSubmit={ onSubmit }
      iconButton={ iconButton }
    />
  )
}

export default memo(ApproveQuestion)