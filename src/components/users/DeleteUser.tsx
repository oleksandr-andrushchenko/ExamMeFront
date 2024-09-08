import { ComponentProps, memo } from 'react'
import deleteUser from '../../api/users/deleteUser'
import { DeleteIcon } from '../../registry/icons'
import User from '../../schema/users/User'
import ConfirmDialog from '../dialogs/ConfirmDialog'

interface Props extends ComponentProps<any> {
  user: User
  onSubmit?: Function
  iconButton?: boolean
}

const DeleteUser = ({ user, onSubmit, iconButton = false }: Props) => {
  return (
    <ConfirmDialog
      mutateOptionsFn={ () => deleteUser(user.id!) }
      iconFn={ DeleteIcon }
      labelFn={ (isSubmitting) => isSubmitting ? 'Deleting User...' : 'Delete User' }
      title={ `Are you sure you want to delete "${ user.name }" user?` }
      body={ <>This will delete "{ user.name }" user permanently.<br/>You cannot undo this action.</> }
      onSubmit={ onSubmit }
      iconButton={ iconButton }
    />
  )
}

export default memo(DeleteUser)