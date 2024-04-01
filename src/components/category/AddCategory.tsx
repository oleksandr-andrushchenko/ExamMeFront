import { Button, Card, CardBody, Dialog, IconButton, Textarea, Tooltip, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import Route from '../../enum/Route'
import { useNavigate } from 'react-router-dom'
import normalizeApiErrors from '../../utils/normalizeApiErrors'
import InputState, { defaultInputState } from '../../types/InputState'
import postCategory from '../../api/category/postCategory'
import Category from '../../schema/category/Category'
import replaceCategory from '../../api/category/replaceCategory'
import getCategory from '../../api/category/getCategory'

interface Props {
  category?: Category
  onSubmit?: (question: Category) => void
  iconButton?: boolean
}

export default ({ category, onSubmit, iconButton }: Props): ReactNode => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

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
  const setNameValue = (value: string): void => {
    const error = getNameError(value)
    setName({ ...name, ...{ value, error } })
  }
  const setNameFocused = (focused: boolean): void => {
    const error = focused ? name.error : getNameError()
    const displayError = error && !focused ? true : name.displayError
    setName({ ...name, ...{ focused, error, displayError } })
  }
  const setNameError = (error: string): void => {
    const displayError = !!error
    setName({ ...name, ...{ error, displayError } })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setProcessing(true)

    try {
      const transfer = { name: name.value }
      const categoryResp = category ? (await replaceCategory(category.id, transfer)) : (await postCategory(transfer))
      setOpen(false)
      const id = category ? category.id : categoryResp.id
      navigate(Route.CATEGORY.replace(':categoryId', id))

      if (onSubmit) {
        getCategory(id).then((category: Category): void => onSubmit(category))
      }
    } catch (err) {
      const errors = normalizeApiErrors(err)
      console.log(errors)
      setNameError(errors?.title || '')
      setError(errors?.unknown || '')
    } finally {
      setProcessing(false)
    }
  }

  return <>
    {
      iconButton
        ? <Tooltip content={ category ? 'Update category' : 'Add category' }>
          <IconButton
            onClick={ handleOpen }
            disabled={ processing }>
            { category ? <PencilIcon className="h-4 w-4"/> : <PlusIcon className="h-4 w-4"/> }
          </IconButton>
        </Tooltip>
        : <Button
          onClick={ handleOpen }
          disabled={ processing }>
          { category ? <PencilIcon className="inline-block h-4 w-4"/> : <PlusIcon
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
              <Typography
                variant="h6"
                color={ name.error && name.displayError ? 'red' : 'blue-gray' }>
                Name
              </Typography>
              <Textarea
                name="name"
                type="text"
                label="Name"
                onChange={ (e) => setNameValue(e.target.value) }
                onFocus={ () => setNameFocused(true) }
                onBlur={ () => setNameFocused(false) }
                value={ name.value }
                aria-invalid={ name.error ? 'true' : 'false' }
                error={ !!name.error && name.displayError }
                required
              />
              { name.error && name.displayError && <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1">
                <ExclamationCircleIcon className="w-1/12"/>
                <span className="w-11/12">{ name.error }</span>
              </Typography> }
            </div>

            { error && <Typography
              variant="small"
              color="red"
              className="flex items-center gap-1">
              <ExclamationCircleIcon className="w-1/12"/>
              <span className="w-11/12">{ error }</span>
            </Typography> }

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