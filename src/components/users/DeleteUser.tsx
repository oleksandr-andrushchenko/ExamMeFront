import { Card, CardBody, CardFooter, Dialog, Typography } from '@material-tailwind/react'
import { memo, useState } from 'react'
import { apiMutate } from '../../api/apolloClient'
import deleteUser from '../../api/users/deleteUser'
import Error from '../Error'
import { DeleteIcon } from '../../registry/icons'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import User from '../../schema/users/User'

interface Props {
  user: User
  onSubmit?: () => void
  iconButton?: boolean
}

const DeleteUser = ({ user, onSubmit, iconButton }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    apiMutate(
      deleteUser(user.id!),
      _ => {
        setOpen(false)
        onSubmit && onSubmit()
      },
      setError,
      setProcessing,
    )
  }

  const icon = DeleteIcon
  const label = processing ? 'Deleting User...' : 'Delete User'

  return <>
    { iconButton
      ? <IconButton icon={ icon } tooltip={ label } onClick={ handleOpen } disabled={ processing }/>
      : <Button icon={ icon } label={ label } onClick={ handleOpen } disabled={ processing }/> }
    <Dialog open={ open } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Are you sure you want to delete "{ user.name }" user?
          </Typography>
          <Typography className="mb-3" variant="paragraph" color="gray">
            This will delete "{ user.name }" user permanently.
            <br/>
            You cannot undo this action.
          </Typography>

          { error && <Error text={ error } simple/> }
        </CardBody>
        <CardFooter className="pt-0">
          <Button label="Cancel" onClick={ handleOpen }/>{ ' ' }
          <Button icon={ icon } label={ label } size="md" onClick={ onClick } disabled={ processing }/>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}

export default memo(DeleteUser)