import { ComponentProps, memo, useState } from 'react'
import Question from '../../schema/question/Question'
import { DisabledIcon, EnabledIcon } from '../../registry/icons'
import toggleQuestionApprove from '../../api/question/toggleQuestionApprove'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import { apiMutate } from '../../api/apolloClient'
import Error from '../Error'
import YesNo from '../elements/YesNo'

interface Props extends ComponentProps<any> {
  question: Question
  onChange?: Function
  iconButton?: boolean
  readonly?: boolean
}

const _ApproveQuestion = ({ question, onChange, iconButton = false, readonly = false }: Props) => {
  const [ isApproved, setApproved ] = useState<boolean>(question.isApproved!)
  const [ isSubmitting, setSubmitting ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')

  if (readonly) {
    return (
      <YesNo yes={ isApproved }/>
    )
  }

  const icon = isApproved ? EnabledIcon : DisabledIcon
  const label = isApproved
    ? (isSubmitting ? 'Un-approving Question...' : 'Un-approve Question')
    : (isSubmitting ? 'Approving Question...' : 'Approve Question')

  const onClick = () => {
    apiMutate(
      // todo: change depending on onChange is defined or not
      toggleQuestionApprove(question.id!),
      (data: { toggleQuestionApprove: Question }) => {
        const updatedQuestion = data.toggleQuestionApprove
        setApproved(updatedQuestion.isApproved!)
        onChange && onChange(updatedQuestion)
      },
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

export const ApproveQuestion = memo(_ApproveQuestion)