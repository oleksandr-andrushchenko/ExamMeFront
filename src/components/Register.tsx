import { Button, Card, CardBody, Checkbox, Dialog, Typography } from '@material-tailwind/react'
import { ArrowRightEndOnRectangleIcon, ExclamationCircleIcon, UserPlusIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmailSection from './EmailSection'
import PasswordSection from './PasswordSection'
import useAuth from '../hooks/useAuth'
import postAuth from '../api/postAuth'
import normalizeApiErrors from '../utils/normalizeApiErrors'
import Route from '../enum/Route'
import postMe from '../api/me/postMe'

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

  const [ terms, setTerms ] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setProcessing(true)

    try {
      await postMe({ email, password })
      setAuth(await postAuth({ email, password }))
      navigate(Route.CATEGORIES, { replace: true })
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
      size="sm"
      onClick={ handleOpen }
      disabled={ processing }>
      <UserPlusIcon className="inline-block h-4 w-4"/> Register
    </Button>
    <Dialog size="xs" open={ open } handler={ handleOpen } className="bg-transparent shadow-none">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">Register</Typography>
          <form className="flex flex-col gap-6" onSubmit={ handleSubmit }
                method="post">

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
                disabled={ !email || !password || !terms || processing }>
                { processing ? 'Registering in...' : 'Register' }
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Dialog>
  </>
}