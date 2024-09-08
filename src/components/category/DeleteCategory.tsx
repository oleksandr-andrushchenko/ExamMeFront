import { ComponentProps, memo } from 'react'
import Category from '../../schema/category/Category'
import deleteCategory from '../../api/category/deleteCategory'
import { DeleteIcon } from '../../registry/icons'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface Props extends ComponentProps<any> {
  category: Category
  onSubmit?: Function
  iconButton?: boolean
}

const DeleteCategory = ({ category, onSubmit, iconButton = false }: Props) => {
  return (
    <ConfirmDialog
      mutateOptionsFn={ () => deleteCategory(category.id!) }
      iconFn={ DeleteIcon }
      labelFn={ (isSubmitting) => isSubmitting ? 'Deleting Category...' : 'Delete Category' }
      title={ `Are you sure you want to delete "${ category.name }" category?` }
      body={ <>This will delete "{ category.name }" category and all its questions [ { category.questionCount ?? 0 } ]
        permanently.<br/>You cannot undo this action.</> }
      onSubmit={ onSubmit }
      iconButton={ iconButton }
    />
  )
}

export default memo(DeleteCategory)