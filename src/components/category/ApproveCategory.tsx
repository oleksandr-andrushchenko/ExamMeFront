import { ComponentProps, memo, useState } from 'react'
import Category from '../../schema/category/Category'
import { DisabledIcon, EnabledIcon } from '../../registry/icons'
import toggleCategoryApprove from '../../api/category/toggleCategoryApprove'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import { apiMutate } from '../../api/apolloClient'
import Error from '../Error'

interface Props extends ComponentProps<any> {
  category: Category
  onSubmit?: Function
  iconButton?: boolean
}

const ApproveCategory = ({ category, onSubmit, iconButton }: Props) => {
  const [ isSubmitting, setSubmitting ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')

  const icon = category.isApproved ? EnabledIcon : DisabledIcon
  const label = category.isApproved
    ? (isSubmitting ? 'Un-approving Category...' : 'Un-approve Category')
    : (isSubmitting ? 'Approving Category...' : 'Approve Category')

  const onClick = () => {
    apiMutate(
      toggleCategoryApprove(category.id!),
      (data: { toggleCategoryApprove: Category }) => onSubmit && onSubmit(data.toggleCategoryApprove),
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

export default memo(ApproveCategory)