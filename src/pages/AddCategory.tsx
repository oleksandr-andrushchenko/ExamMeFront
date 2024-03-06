import { Breadcrumbs, Button, Input, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, HomeIcon, SquaresPlusIcon } from '@heroicons/react/24/solid'
import { Link, useNavigate } from 'react-router-dom'
import Route from '../enum/Route'
import React, { ReactNode, useState } from 'react'
import postCategory from '../api/postCategory'
import InputState, { defaultInputState } from '../types/InputState'
import normalizeApiErrors from '../utils/normalizeApiErrors'

export default (): ReactNode => {
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

  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ error, setError ] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const category = await postCategory({ name: name.value })
      navigate(Route.CATEGORY.replace(':categoryId', category.id))
    } catch (err) {
      const errors = normalizeApiErrors(err)
      console.log(errors)
      setNameError(errors?.title || '')
      setError(errors?.unknown || '')
    } finally {
      setSubmitting(false)
    }
  }

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon
        className="inline-block w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
      <Link to={ Route.ADD_CATEGORY }>Add Category</Link>
    </Breadcrumbs>
    <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">
      <SquaresPlusIcon className="inline-block h-8 w-8 mr-1"/> Add Category
    </Typography>
    <Typography variant="small" color="gray" className="mt-1 font-normal">
      Create new category
    </Typography>
    <form className="mt-6 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" onSubmit={ handleSubmit }
          method="post">

      <div className="flex flex-col gap-2">
        <Typography
          variant="h6"
          color={ name.error && name.displayError ? "red" : "blue-gray" }>
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
          aria-invalid={ name.error ? "true" : "false" }
          error={ !!name.error && name.displayError }
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
        <Button className="block rounded capitalize" type="submit"
                disabled={ !name.value || !!name.error || submitting }>
          { submitting ? 'Adding...' : 'Add' }
        </Button>
      </div>
    </form>
  </>
}