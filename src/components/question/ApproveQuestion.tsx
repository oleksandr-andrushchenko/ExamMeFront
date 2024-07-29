import { ComponentProps, memo, useState } from 'react'
import Question from '../../schema/question/Question'
import { DisabledIcon, EnabledIcon } from '../../registry/icons'
import toggleQuestionApprove from '../../api/question/toggleQuestionApprove'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import { apiMutate } from '../../api/apolloClient'
import Error from '../Error'

interface Props extends ComponentProps<any> {
  question: Question
  onSubmit?: Function
  iconButton?: boolean
}

const ApproveQuestion = ({ question, onSubmit, iconButton }: Props) => {
  const [ isSubmitting, setSubmitting ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')

  const icon = question.isApproved ? EnabledIcon : DisabledIcon
  const label = question.isApproved
    ? (isSubmitting ? 'Un-approving Question...' : 'Un-approve Question')
    : (isSubmitting ? 'Approving Question...' : 'Approve Question')

  const onClick = () => {
    apiMutate(
      toggleQuestionApprove(question.id!),
      (data: { toggleQuestionApprove: Question }) => onSubmit && onSubmit(data.toggleQuestionApprove),
      setError,
      setSubmitting,
    )
  }

  return (
    <>
      { error && <Error text={ error } simple/> }
      { iconButton
        ? <IconButton icon={ icon } tooltip={ label } onClick={ onClick } disabled={ isSubmitting }/>
        : <Button icon={ icon } label={ label } onClick={ onClick } disabled={ isSubmitting }/> }
    </>
  )
}

export default memo(ApproveQuestion)