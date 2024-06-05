import { Button, Card, CardBody, Dialog, IconButton, Textarea, Tooltip, Typography } from '@material-tailwind/react'
import { PencilSquareIcon as UpdateIcon, PlusIcon as CreateIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import InputState, { defaultInputState } from '../../schema/InputState'
import Category from '../../schema/category/Category'
import { apiMutate } from '../../api/apolloClient'
import updateCategoryMutation from '../../api/category/updateCategoryMutation'
import createCategoryMutation from '../../api/category/createCategoryMutation'
import Error from '../Error'

interface Props {
  category?: Category
  onSubmit?: (question: Category) => void
  iconButton?: boolean
}

export default function AddCategory({ category, onSubmit, iconButton }: Props) {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const [ name, setName ] = useState<InputState>({ ...defaultInputState, ...{ value: category?.name } })
  const getNameError = (value: string | undefined = undefined): string => {
    value = value === undefined ? name.value : value

    if (!value) {
      return 'Should not be empty'
    }

    if (value.length < 3 || value.length > 100) {
      return 'Should be from 3 to 100 characters long'
    }

    if (value && !/^[a-zA-Z]/.test(value)) {
      return 'Should have letters'
    }

    return ''
  }
  const setNameValue = (value: string) => {
    const error = getNameError(value)
    setName({ ...name, ...{ value, error } })
  }
  const setNameFocused = (focused: boolean) => {
    const error = focused ? name.error : getNameError()
    const displayError = error && !focused ? true : name.displayError
    setName({ ...name, ...{ focused, error, displayError } })
  }
  const setNameError = (error: string) => {
    const displayError = !!error
    setName({ ...name, ...{ error, displayError } })
  }

  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault()
    setProcessing(true)

    const transfer = { name: name.value }
    const callback = (affectedCategory: Category) => {
      if (!category) {
        setName({ ...defaultInputState })
      }

      setOpen(false)
      onSubmit && onSubmit(affectedCategory)
    }

    if (category) {
      apiMutate<{ updateCategory: Category }>(
        updateCategoryMutation(category.id!, transfer),
        data => callback(data.updateCategory),
        setError,
        setProcessing,
      )
    } else {
      apiMutate<{ createCategory: Category }>(
        createCategoryMutation(transfer),
        data => callback(data.createCategory),
        setError,
        setProcessing,
      )
    }
  }

  return <>
    {
      iconButton
        ? <Tooltip content={ category ? 'Update category' : 'Add category' }>
          <IconButton
            onClick={ handleOpen }
            disabled={ processing }>
            { category ? <UpdateIcon className="h-4 w-4"/> : <CreateIcon className="h-4 w-4"/> }
          </IconButton>
        </Tooltip>
        : <Button
          onClick={ handleOpen }
          disabled={ processing }>
          { category ? <UpdateIcon className="inline-block h-4 w-4"/> : <CreateIcon
            className="inline-block h-4 w-4"/> } { category ? (processing ? 'Updating category...' : 'Update category') : (processing ? 'Adding category...' : 'Add category') }
        </Button>
    }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4">
            { category ? 'Update category' : 'Add category' }
          </Typography>
          <form className="flex flex-col gap-6" onSubmit={ handleSubmit } method="post">
            <div className="flex flex-col gap-2">
              <Textarea
                rows={ 1 }
                resize
                name="name"
                type="text"
                label="Name"
                onChange={ (e) => setNameValue(e.target.value) }
                onFocus={ () => setNameFocused(true) }
                onBlur={ () => setNameFocused(false) }
                value={ name.value }
                aria-invalid={ name.error ? 'true' : 'false' }
                error={ !!name.error && name.displayError }
                required/>
              { name.error && name.displayError && <Error text={ name.error }/> }
            </div>

            { error && <Error text={ error }/> }

            <div>
              <Button
                type="reset"
                onClick={ handleOpen }>
                Cancel
              </Button>
              <Button
                size="md"
                className="ml-1"
                type="submit"
                disabled={ !name.value || !!name.error || processing }>
                { category ? (processing ? 'Updating...' : 'Update') : (processing ? 'Adding...' : 'Add') }
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Dialog>
  </>
}