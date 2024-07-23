import { memo, useState } from 'react'
import Question from '../../schema/question/Question'
import { DisabledIcon, EnabledIcon } from '../../registry/icons'
import toggleQuestionApprove from '../../api/question/toggleQuestionApprove'
import isQuestionApproved from '../../services/questions/isQuestionApproved'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import { apiMutate } from '../../api/apolloClient'
import Error from '../Error'

interface Props {
  question: Question
  onSubmit?: Function
  iconButton?: boolean
}

const ApproveQuestion = ({ question, onSubmit, iconButton }: Props) => {
  const [ isSubmitting, setSubmitting ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')

  const icon = isQuestionApproved(question) ? EnabledIcon : DisabledIcon
  const label = isQuestionApproved(question)
    ? (isSubmitting ? 'Un-approving Question...' : 'Un-approve Question')
    : (isSubmitting ? 'Approving Question...' : 'Approve Question')

  const onClick = () => {
    apiMutate(
      toggleQuestionApprove(question.id!),
      data => onSubmit && onSubmit(data),
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