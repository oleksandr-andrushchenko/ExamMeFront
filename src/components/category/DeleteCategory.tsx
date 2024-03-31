import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import Route from '../../enum/Route'
import { useNavigate } from 'react-router-dom'
import Category from '../../schema/category/Category'
import deleteCategory from '../../api/category/deleteCategory'
import normalizeApiErrors from '../../utils/normalizeApiErrors'

interface Props {
  category: Category
  onSubmit?: () => void
  iconButton?: boolean
}

export default ({ category, onSubmit, iconButton }: Props): ReactNode => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  useEffect((): void => {
    if (processing) {
      deleteCategory(category.id)
        .then((): void => {
          navigate(Route.CATEGORIES, { replace: true })
          onSubmit && onSubmit()
        })
        .catch((error): void => {
          const errors = normalizeApiErrors(error)
          console.log(errors)
          setError(errors?.unknown || '')
        })
        .finally((): void => setProcessing(false))
    }
  }, [ processing ])

  return <>
    {
      iconButton
        ? <Tooltip content="Delete category">
          <IconButton
            onClick={ handleOpen }
            disabled={ processing }>
            <XMarkIcon className="h-4 w-4"/>
          </IconButton>
        </Tooltip>
        : <Button
          onClick={ handleOpen }
          disabled={ processing }>
          <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting category...' : 'Delete category' }
        </Button>
    }
    <Dialog size="xs" open={ open } handler={ handleOpen } className="bg-transparent shadow-none">
      <Card className="mx-auto w-full max-w-[24rem] text-center">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Are you sure you want to delete "{ category.name }" category?
          </Typography>
          <Typography
            className="mb-3"
            variant="paragraph"
            color="gray">
            This will delete "{ category.name }" category and all its questions [ { category.questionCount } ]
            permanently.
            <br/>
            You cannot undo this action.
          </Typography>
          { error && <Typography color="red">
            <ExclamationCircleIcon className="inline-block h-5 w-5"/> { error }
          </Typography> }
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            onClick={ handleOpen }>
            Cancel
          </Button>
          <Button
            size="md"
            className="ml-1"
            onClick={ () => setProcessing(true) }
            disabled={ processing }>
            <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting...' : 'Delete' }
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}