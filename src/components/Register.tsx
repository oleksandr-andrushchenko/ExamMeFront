import { Button, Typography } from '@material-tailwind/react'
import React, { ReactNode, useState } from 'react'
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
import registerMutation from '../api/auth/registerMutation'

interface Props {
  onSubmit: () => void
  buttons?: ReactNode
}

interface Form {
  Email: string
  Password: string
  ConfirmPassword: string
  Terms: boolean
}

export default function Register({ buttons, onSubmit }: Props) {
  const [ error, setError ] = useState<string>('')
  const { setAuth } = useAuth()

  return (
    <Formik
      initialValues={ {
        Email: '',
        Password: '',
        ConfirmPassword: '',
        Terms: false,
      } }
      validationSchema={ yup.object({
        Email: yup.string().email().required(),
        Password: yup.string().min(8).max(24).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()])/).required(),
        ConfirmPassword: yup.string().required().oneOf([ yup.ref('Password'), null ] as any, 'Passwords must match'),
        Terms: yup.bool().required().oneOf([ true ], 'Terms must be accepted'),
      }) }
      onSubmit={ (values, { setSubmitting }: FormikHelpers<Form>): any => {
        const transfer = {
          email: values.Email,
          password: values.Password,
        }
        apiMutate<{ authenticate: Token }>(
          registerMutation(transfer),
          data => setAuth(data.authenticate) && onSubmit(),
          setError,
          setSubmitting,
        )
      } }>
      { ({ isSubmitting }) => (
        <Form className="flex flex-col gap-6">
          <Typography variant="h4" color="blue-gray">Register</Typography>

          <div className="flex flex-col gap-2">
            <FormikInput name="Email" type="email" label="Email Address"/>
          </div>

          <div className="flex flex-col gap-2">
            <FormikInput name="Password" type="password" label="Password"/>
          </div>

          <div className="flex flex-col gap-2">
            <FormikInput name="ConfirmPassword" type="password" label="Confirm password"/>
          </div>

          <div className="-mt-4">
            <FormikCheckbox name="Terms">
              I agree the <Link to={ Route.TERMS_AND_CONDITIONS }>Terms and Conditions</Link>
            </FormikCheckbox>
          </div>

          { error && <Error text={ error }/> }

          <div>
            { buttons }
            <Button type="submit" className="ml-1" size="md" disabled={ isSubmitting }>
              { isSubmitting ? 'Registering in...' : 'Register' }
            </Button>
          </div>
        </Form>
      ) }
    </Formik>
  )
}