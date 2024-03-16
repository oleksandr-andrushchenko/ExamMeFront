import { Button, Checkbox, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import EmailSection from './EmailSection'
import PasswordSection from './PasswordSection'
import useAuth from '../hooks/useAuth'
import postAuth from '../api/postAuth'
import normalizeApiErrors from '../utils/normalizeApiErrors'
import Route from '../enum/Route'
import postMe from '../api/me/postMe'

interface Props {
  onSubmit: () => void,

  buttons?: ReactNode,
}

export default ({ buttons, onSubmit }: Props): ReactNode => {
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
    setProcessing(true)

    try {
      await postMe({ email, password })
      setAuth(await postAuth({ email, password }))
      onSubmit()
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
        disabled={ !email || !password || !terms || processing }>
        { processing ? 'Registering in...' : 'Register' }
      </Button>
    </div>
  </form>
}