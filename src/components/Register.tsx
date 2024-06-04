import { Button, Checkbox, Typography } from '@material-tailwind/react'
import React, { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import EmailSection from './EmailSection'
import PasswordSection from './PasswordSection'
import useAuth from '../hooks/useAuth'
import Route from '../enum/Route'
import { apiMutate } from '../api/apolloClient'
import registerMutation from '../api/auth/registerMutation'
import Token from '../schema/auth/Token'
import Error from './Error'

interface Props {
  onSubmit: () => void
  buttons?: ReactNode
}

export default function Register({ buttons, onSubmit }: Props): ReactNode {
  const [ processing, setProcessing ] = useState<boolean>(false)
  const [ email, setEmail ] = useState<string>('')
  const [ emailError, setEmailError ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ passwordError, setPasswordError ] = useState<string>('')
  const [ error, setError ] = useState<string>('')
  const { setAuth } = useAuth()
  const [ terms, setTerms ] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    apiMutate<{ authenticate: Token }>(
      registerMutation({ email, password }),
      (data): void => setAuth(data.authenticate) && onSubmit(),
      setError,
      setProcessing,
    )
  }

  return <form className="flex flex-col gap-6" onSubmit={ handleSubmit } method="post">
    <Typography variant="h4" color="blue-gray">Register</Typography>

    <EmailSection setValue={ setEmail as any } error={ emailError } focus/>
    <PasswordSection setValue={ setPassword as any } error={ passwordError } confirm/>

    <div className="-mt-4">
      <Checkbox
        label={
          <Typography
            variant="small"
            color="gray"
            className="flex items-center font-normal">
            I agree the
            <Link to={ Route.TERMS_AND_CONDITIONS }>Terms and Conditions</Link>
          </Typography>
        }
        onChange={ (e) => setTerms(e.target.checked) }
        required
      />
    </div>

    { error && <Error text={ error }/> }

    <div>
      { buttons }
      <Button
        size="md"
        type="submit"
        className="ml-1"
        disabled={ !email || !password || !terms || processing }>
        { processing ? 'Registering in...' : 'Register' }
      </Button>
    </div>
  </form>
}