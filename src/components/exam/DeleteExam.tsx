import { Button, Card, CardBody, CardFooter, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import Exam from '../../schema/exam/Exam'
import Category from '../../schema/category/Category'
import Spinner from '../Spinner'
import apolloClient, { apiQuery } from '../../api/apolloClient'
import removeExamMutation from '../../api/exam/removeExamMutation'
import categoryNameQuery from '../../api/category/categoryNameQuery'

interface Props {
  exam: Exam
  onSubmit?: () => void
  iconButton?: boolean
}

export default function DeleteExam({ exam, onSubmit, iconButton }: Props): ReactNode {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ category, setCategory ] = useState<Category>()
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')

  const onClick = () => {
    setProcessing(true)
    apolloClient.mutate(removeExamMutation(exam.id!))
      .then(_ => {
        setOpen(false)
        onSubmit && onSubmit()
      })
      .catch((err) => setError(err.message))
      .finally(() => setProcessing(false))
  }

  useEffect(() => {
    apiQuery<{ category: Category }>(
      categoryNameQuery(exam.categoryId!),
      (data): void => setCategory(data.category),
      setError,
      setLoading,
    )
  }, [])

  return <>
    {
      iconButton
        ? <Tooltip content="Delete exam">
          <IconButton
            onClick={ handleOpen }
            disabled={ processing }>
            <XMarkIcon className="h-4 w-4"/>
          </IconButton>
        </Tooltip>
        : <Button
          onClick={ handleOpen }
          disabled={ processing }>
          <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting Exam...' : 'Delete Exam' }
        </Button>
    }
    <Dialog open={ open } handler={ handleOpen }>
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            { category === undefined ? <Spinner/> : `Are you sure you want to delete "${ category.name }" exam?` }
          </Typography>
          <Typography
            className="mb-3"
            variant="paragraph"
            color="gray">
            { category === undefined ? <Spinner/> : `This will delete "${ category.name }" exam permanently.` }
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
            onClick={ onClick }
            disabled={ processing }>
            <XMarkIcon className="inline-block h-4 w-4"/> { processing ? 'Deleting...' : 'Delete' }
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  </>
}