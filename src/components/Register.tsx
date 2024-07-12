import { Button, Typography } from '@material-tailwind/react'
import { memo, ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Route from '../enum/Route'
import Error from './Error'
import { Form, Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'
import FormikInput from './formik/FormikInput'
import FormikCheckbox from './formik/FormikCheckbox'
import { apiMutate } from '../api/apolloClient'
import Token from '../schema/auth/Token'
import createMeAndAuthenticationToken from '../api/me/createMeAndAuthenticationToken'

interface Props {
  onSubmit: () => void
  buttons?: ReactNode
}

interface Form {
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

const Register = ({ buttons, onSubmit }: Props) => {
  const [ error, setError ] = useState<string>('')
  const { setAuthenticationToken } = useAuth()

  return (
    <Formik
      initialValues={ {
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
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
        confirmPassword: yup.string()
          .required('Confirm password is required')
          .oneOf([ yup.ref('password'), null ], 'Passwords must match'),
        terms: yup.bool()
          .oneOf([ true ], 'Terms must be accepted'),
      }) }
      onSubmit={ (values, { setSubmitting }: FormikHelpers<Form>): any => {
        const transfer = {
          email: values.email,
          password: values.password,
        }
        apiMutate<{ createAuthenticationToken: Token }>(
          createMeAndAuthenticationToken(transfer),
          data => setAuthenticationToken(data.createAuthenticationToken) && onSubmit(),
          setError,
          setSubmitting,
        )
      } }>
      { ({ isSubmitting }) => (
        <Form className="flex flex-col gap-6">
          <Typography variant="h4" color="blue-gray">Register</Typography>

          <FormikInput name="email" type="email" label="Email Address"/>
          <FormikInput name="password" type="password" label="Password"/>
          <FormikInput name="confirmPassword" type="password" label="Confirm password"/>

          <FormikCheckbox name="terms">
            I agree to the <Link to={ Route.TERMS }>Terms and Conditions</Link>
          </FormikCheckbox>

          { error && <Error text={ error }/> }

          <div>
            { buttons }
            <Button type="submit" className="ml-1" size="md" disabled={ isSubmitting }>
              { isSubmitting ? 'Registering...' : 'Register' }
            </Button>
          </div>
        </Form>
      ) }
    </Formik>
  )
}

export default memo(Register)
