import { ComponentProps, memo, useState } from 'react'
import Category from '../../schema/category/Category'
import { DisabledIcon, EnabledIcon } from '../../registry/icons'
import toggleCategoryApprove from '../../api/category/toggleCategoryApprove'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import { apiMutate } from '../../api/apolloClient'
import Error from '../Error'
import YesNo from '../elements/YesNo'

interface Props extends ComponentProps<any> {
  category: Category
  onChange?: Function
  iconButton?: boolean
  readonly?: boolean
}

const _ApproveCategory = ({ category, onChange, iconButton = false, readonly = false }: Props) => {
  const [ isApproved, setApproved ] = useState<boolean>(category.isApproved!)
  const [ isSubmitting, setSubmitting ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')

  if (readonly) {
    return (
      <YesNo yes={ isApproved }/>
    )
  }

  const icon = isApproved ? EnabledIcon : DisabledIcon
  const label = isApproved
    ? (isSubmitting ? 'Un-approving Category...' : 'Un-approve Category')
    : (isSubmitting ? 'Approving Category...' : 'Approve Category')

  const onClick = () => {
    apiMutate(
      // todo: change depending on onChange is defined or not
      toggleCategoryApprove(category.id!),
      (data: { toggleCategoryApprove: Category }) => {
        const updatedCategory = data.toggleCategoryApprove
        setApproved(updatedCategory.isApproved!)
        onChange && onChange(updatedCategory)
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

export const ApproveCategory = memo(_ApproveCategory)