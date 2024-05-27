import { Button, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import EmailSection from './EmailSection'
import PasswordSection from './PasswordSection'
import useAuth from '../hooks/useAuth'
import { apiMutate } from '../api/apolloClient'
import Token from '../schema/auth/Token'
import authenticateMutation from '../api/auth/authenticateMutation'

interface Props {
  onSubmit: () => void
  buttons?: ReactNode
  onRegisterClick?: () => void
}

export default ({ onSubmit, buttons, onRegisterClick }: Props): ReactNode => {
  const [ processing, setProcessing ] = useState<boolean>(false)
  const [ email, setEmail ] = useState<string>('')
  const [ emailError, setEmailError ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ passwordError, setPasswordError ] = useState<string>('')
  const [ error, setError ] = useState<string>('')
  const { setAuth } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    apiMutate<{ authenticate: Token }>(
      authenticateMutation({ email, password }),
      (data): void => setAuth(data.authenticate) && onSubmit(),
      setError,
      setProcessing,
    )
  }

  return <form className="flex flex-col gap-6" onSubmit={ handleSubmit } method="post">
    <Typography variant="h4" color="blue-gray">Login</Typography>

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
      { buttons }
      <Button
        size="md"
        type="submit"
        className="ml-1"
        disabled={ !email || !password || processing }>
        { processing ? 'Logging in...' : 'Login' }
      </Button>
      { onRegisterClick && <Typography variant="small" color="gray" className="mt-4 font-normal">
        Don't have an account? <Button variant="text" onClick={ onRegisterClick }
                                       className="font-medium text-gray-900">Register</Button>
      </Typography> }
    </div>
  </form>
}