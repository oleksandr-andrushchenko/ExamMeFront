import { Button, Typography } from '@material-tailwind/react'
import { memo, ReactNode, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { apiMutate } from '../api/apolloClient'
import Error from './Error'
import { Form, Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'
import FormikInput from './formik/FormikInput'
import Token from '../schema/auth/Token'
import createAuthenticationToken from '../api/authenticate/createAuthenticationToken'

interface Props {
  onSubmit?: () => void
  buttons?: ReactNode
  onRegisterClick?: () => void
}

interface Form {
  email: string
  password: string
}

const Login = ({ onSubmit, buttons, onRegisterClick }: Props) => {
  const [ error, setError ] = useState<string>('')
  const { setAuthenticationToken } = useAuth()

  return (
    <Formik
      initialValues={ {
        email: '',
        password: '',
      } }
      validationSchema={ yup.object({
        email: yup.string()
          .email('Invalid email address')
          .required('Email is required'),
        password: yup.string()
          .min(8, 'Password must be at least 8 characters')
          .max(24, 'Password cannot exceed 24 characters')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()])/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
          .required('Password is required'),
      }) }
      onSubmit={ (values, { setSubmitting }: FormikHelpers<Form>) => {
        const transfer = {
          email: values.email,
          password: values.password,
        }
        apiMutate(
          createAuthenticationToken(transfer),
          (data: { createAuthenticationToken: Token }) => {
            setAuthenticationToken(data.createAuthenticationToken)
            onSubmit && onSubmit()
          },
          setError,
          setSubmitting,
        )
      } }>
      { ({ isSubmitting }) => (
        <Form className="flex flex-col gap-6">
          <Typography variant="h4" color="blue-gray">Login</Typography>

          <FormikInput name="email" type="email" label="Email Address"/>
          <FormikInput name="password" type="password" label="Password"/>

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

export default memo(Login)
