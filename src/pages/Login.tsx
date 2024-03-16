import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumbs, Button, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon, HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import EmailSection from '../components/EmailSection'
import PasswordSection from '../components/PasswordSection'
import useAuth from '../hooks/useAuth'
import Route from '../enum/Route'
import postAuth from '../api/postAuth'
import normalizeApiErrors from '../utils/normalizeApiErrors'

interface Props {
  refresh?: boolean,
}

export default ({ refresh }: Props): ReactNode => {
  const [ email, setEmail ] = useState<string>('')
  const [ emailError, setEmailError ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ passwordError, setPasswordError ] = useState<string>('')
  const [ error, setError ] = useState<string>('')
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const { setAuth } = useAuth()

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setSubmitting(true)

    try {
      setAuth(await postAuth({ email, password }))
      refresh ? navigate(0) : navigate(Route.CATEGORIES, { replace: true })
    } catch (err) {
      const errors = normalizeApiErrors(err)
      console.log(errors)
      setEmailError(errors?.email || '')
      setPasswordError(errors?.password || '')
      setError(errors?.unknown || '')
    } finally {
      setSubmitting(false)
    }
  }

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon
        className="inline-block w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.LOGIN }>Login</Link>
    </Breadcrumbs>
    <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">Login</Typography>
    <Typography variant="small" color="gray" className="mt-1 font-normal">
      Enter your details to login
    </Typography>
    <form className="mt-6 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" onSubmit={ handleSubmit }
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
          type="submit"
          disabled={ !email || !password || submitting }>
          { submitting ? 'Logging in...' : 'Login' }
        </Button>
        <Typography variant="small" color="gray" className="mt-4 font-normal">
          Don't have an account? <Link to={ Route.REGISTER } className="font-medium text-gray-900">Register</Link>
        </Typography>
      </div>
    </form>
  </>
}