import { Button, Card, CardBody, Dialog, Typography } from '@material-tailwind/react'
import { ArrowRightEndOnRectangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmailSection from './EmailSection'
import PasswordSection from './PasswordSection'
import useAuth from '../hooks/useAuth'
import postAuth from '../api/postAuth'
import normalizeApiErrors from '../utils/normalizeApiErrors'
import Route from '../enum/Route'

interface Props {
}

export default ({}: Props): ReactNode => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const navigate = useNavigate()
  const [ email, setEmail ] = useState<string>('')
  const [ emailError, setEmailError ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ passwordError, setPasswordError ] = useState<string>('')
  const [ error, setError ] = useState<string>('')
  const { setAuth } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setProcessing(true)

    try {
      setAuth(await postAuth({ email, password }))
      navigate(0)
    } catch (err) {
      const errors = normalizeApiErrors(err)
      console.log(errors)
      setEmailError(errors?.email || '')
      setPasswordError(errors?.password || '')
      setError(errors?.unknown || '')
    } finally {
      setProcessing(false)
    }
  }

  return <>
    <Button
      size="md"
      onClick={ handleOpen }
      disabled={ processing }>
      <ArrowRightEndOnRectangleIcon className="inline-block h-4 w-4"/> Login
    </Button>
    <Dialog size="xs" open={ open } handler={ handleOpen } className="bg-transparent shadow-none">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">Login</Typography>
          <form className="flex flex-col gap-6" onSubmit={ handleSubmit }
                method="post">

            <EmailSection setValue={ setEmail as any } error={ emailError } focus/>
            <PasswordSection setValue={ setPassword as any } error={ passwordError }/>

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
                type="reset"
                onClick={ handleOpen }>
                Cancel
              </Button>

              <Button
                size="md"
                type="submit"
                className="ml-1"
                disabled={ !email || !password || processing }>
                { processing ? 'Logging in...' : 'Login' }
              </Button>
              <Typography variant="small" color="gray" className="mt-4 font-normal">
                Don't have an account? <Link onClick={ handleOpen } to={ Route.REGISTER }
                                             className="font-medium text-gray-900">Register</Link>
              </Typography>
            </div>

            { error && <Typography
              variant="small"
              color="red"
              className="flex items-center gap-1 font-normal">
              <ExclamationCircleIcon className="w-1/12"/>
              <span className="w-11/12">{ error }</span>
            </Typography> }
          </form>
        </CardBody>
      </Card>
    </Dialog>
  </>
}