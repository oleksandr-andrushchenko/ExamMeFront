import { Button, Card, CardBody, Dialog, Input, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, PlusIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import Route from '../../enum/Route'
import { useNavigate } from 'react-router-dom'
import normalizeApiErrors from '../../utils/normalizeApiErrors'
import InputState, { defaultInputState } from '../../types/InputState'
import postCategory from '../../api/category/postCategory'

export default (): ReactNode => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  const [ name, setName ] = useState<InputState>({ ...defaultInputState })
  const getNameError = (value: string | undefined = undefined): string => {
    value = value === undefined ? name.value : value

    if (!value) {
      return 'Should not be empty'
    }

    if (value && !/^[a-zA-Z0-9 ]{2,24}$/.test(value)) {
      return 'Should be from 2 to 24 characters long, lowercase and digits allowed'
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
      const category = await postCategory({ name: name.value })
      navigate(Route.CATEGORY.replace(':categoryId', category.id))
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
    <Button
      size="sm"
      color="green"
      className="rounded capitalize font-normal"
      onClick={ handleOpen }
      disabled={ processing }>
      <PlusIcon className="inline-block h-4 w-4"/> { processing ? 'Adding Category...' : 'Add Category' }
    </Button>
    <Dialog size="xs" open={ open } handler={ handleOpen } className="bg-transparent shadow-none">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Add category
          </Typography>
          <form className="flex flex-col gap-6" onSubmit={ handleSubmit }
                method="post">

            <div className="flex flex-col gap-2">
              <Typography
                variant="h6"
                color={ name.error && name.displayError ? 'red' : 'blue-gray' }>
                Name
              </Typography>
              <Input
                name="name"
                type="text"
                size="lg"
                label="Name"
                onChange={ (e) => setNameValue(e.target.value) }
                onFocus={ () => setNameFocused(true) }
                onBlur={ () => setNameFocused(false) }
                value={ name.value }
                aria-invalid={ name.error ? 'true' : 'false' }
                error={ !!name.error && name.displayError }
                placeholder="Name"
                required
              />
              { name.error && name.displayError && <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal">
                <ExclamationCircleIcon className="w-1/12"/>
                <span className="w-11/12">{ name.error }</span>
              </Typography> }
            </div>

            { error && <Typography
              variant="small"
              color="red"
              className="flex items-center gap-1 font-normal">
              <ExclamationCircleIcon className="w-1/12"/>
              <span className="w-11/12">{ error }</span>
            </Typography> }

            <div>
              <Button
                size="sm"
                className="rounded capitalize font-normal"
                onClick={ handleOpen }>
                Cancel
              </Button>
              <Button
                size="md"
                color="green"
                className="rounded capitalize ml-1"
                type="submit"
                disabled={ !name.value || !!name.error || processing }>
                { processing ? 'Adding...' : 'Add' }
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Dialog>
  </>
}