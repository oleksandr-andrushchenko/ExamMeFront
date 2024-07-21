import { Card, CardBody, CardFooter, Dialog, Typography } from '@material-tailwind/react'
import { memo, useState } from 'react'
import Category from '../../schema/category/Category'
import { apiMutate } from '../../api/apolloClient'
import deleteCategory from '../../api/category/deleteCategory'
import Error from '../Error'
import { DeleteIcon } from '../../registry/icons'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import H3 from '../typography/H3'

interface Props {
  category: Category
  onSubmit?: () => void
  iconButton?: boolean
}

const DeleteCategory = ({ category, onSubmit, iconButton }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    apiMutate(
      deleteCategory(category.id!),
      _ => {
        setOpen(false)
        onSubmit && onSubmit()
      },
      setError,
      setProcessing,
    )
  }

  const icon = DeleteIcon
  const label = processing ? 'Deleting Category...' : 'Delete Category'

  return <>
    { iconButton
      ? <IconButton icon={ icon } tooltip={ label } onClick={ handleOpen } disabled={ processing }/>
      : <Button icon={ icon } label={ label } onClick={ handleOpen } disabled={ processing }/> }
    <Dialog open={ open } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <H3>Are you sure you want to delete "{ category.name }" category?</H3>

          <Typography className="mb-3" variant="paragraph">
            This will delete "{ category.name }" category and all its questions [ { category.questionCount ?? 0 } ]
            permanently.
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

export default memo(DeleteCategory)