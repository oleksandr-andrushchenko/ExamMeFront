import { Button, Typography } from '@material-tailwind/react'
import React, { ReactNode, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { apiMutate } from '../api/apolloClient'
import Error from './Error'
import { Form, Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'
import FormikInput from './formik/FormikInput'
import Token from '../schema/auth/Token'
import authenticateMutation from '../api/auth/authenticateMutation'

interface Props {
  onSubmit: () => void
  buttons?: ReactNode
  onRegisterClick?: () => void
}

interface Form {
  Email: string,
  Password: string,
}

export default function Login({ onSubmit, buttons, onRegisterClick }: Props) {
  const [ error, setError ] = useState<string>('')
  const { setAuth } = useAuth()

  return (
    <Formik
      initialValues={ {
        Email: '',
        Password: '',
      } }
      validationSchema={ yup.object({
        Email: yup.string().email().required(),
        Password: yup.string().min(8).max(24).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()])/).required(),
      }) }
      onSubmit={ (values, { setSubmitting }: FormikHelpers<Form>) => {
        apiMutate<{ authenticate: Token }>(
          authenticateMutation({ email: values.Email, password: values.Password }),
          data => {
            setSubmitting(false)
            setAuth(data.authenticate) && onSubmit()
          },
          setError,
        )
      } }>
      { ({ isSubmitting }) => (
        <Form className="flex flex-col gap-6">
          <Typography variant="h4" color="blue-gray">Login</Typography>

          <div className="flex flex-col gap-2">
            <FormikInput name="Email" type="email" label="Email Address"/>
          </div>

          <div className="flex flex-col gap-2">
            <FormikInput name="Password" type="password" label="Password"/>
          </div>

          { error && <Error text={ error }/> }

          <div>
            { buttons }

            <Button type="submit" className="ml-1" size="md" disabled={ isSubmitting }>
              { isSubmitting ? 'Logging in...' : 'Login' }
            </Button>

            { onRegisterClick && (
              <Typography variant="small" color="gray" className="mt-4 font-normal">
                Don't have an account?
                <Button variant="text" className="font-medium text-gray-900" onClick={ onRegisterClick }>
                  Register
                </Button>
              </Typography>
            ) }
          </div>
        </Form>
      ) }
    </Formik>
  )
}