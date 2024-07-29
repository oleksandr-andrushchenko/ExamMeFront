import { Card, CardBody, Dialog } from '@material-tailwind/react'
import { ComponentProps, memo, useState } from 'react'
import { apiMutate } from '../../api/apolloClient'
import Error from '../Error'
import { Form, Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'
import User from '../../schema/users/User'
import Permission from '../../enum/Permission'
import updateUser from '../../api/users/updateUser'
import FormikInput from '../formik/FormikInput'
import FormikTags from '../formik/FormikTags'
import { CreateIcon, EditIcon } from '../../registry/icons'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import createUser from '../../api/users/createUser'
import H3 from '../typography/H3'

interface Props extends ComponentProps<any> {
  user?: User
  onSubmit?: (user: User) => void
  iconButton?: boolean
}

interface Form {
  name: string
  email: string
  password: string
  permissions: Permission[]
}

const AddUser = ({ user, onSubmit, iconButton }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const icon = user ? EditIcon : CreateIcon
  const label = user ? 'Update User' : 'Add User'

  return <>
    { iconButton
      ? <IconButton icon={ icon } tooltip={ label } onClick={ handleOpen }/>
      : <Button icon={ icon } label={ label } onClick={ handleOpen }/> }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <H3 icon={ icon } label={ label }/>
          <Formik
            initialValues={ {
              name: user?.name || '',
              email: user?.email || '',
              password: '',
              permissions: user?.permissions || [ Permission.Regular ],
            } }
            validationSchema={ yup.object({
              name: yup.string()
                .min(2, 'Name must be at least 2 characters')
                .max(30, 'Name cannot exceed 30 characters')
                .required('Name is required'),
              email: yup.string()
                .email('Invalid email address')
                .required('Email is required'),
              password: yup.string()
                .min(8, 'Password must be at least 8 characters')
                .max(24, 'Password cannot exceed 24 characters')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()])/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
              permissions: yup.array()
                .of(yup.string().oneOf(Object.values(Permission), 'Invalid permission'))
                .required('At least one permission is required'),
            }) }
            onSubmit={ (values, { setSubmitting }: FormikHelpers<Form>) => {
              const transfer: any = {
                name: values.name,
                email: values.email,
                permissions: [ ...new Set(values.permissions) ],
              }

              if (values.password) {
                transfer.password = values.password
              }

              const callback = (user: User) => {
                setOpen(false)
                onSubmit && onSubmit(user)
              }

              if (user) {
                apiMutate(
                  updateUser(user.id!, transfer),
                  (data: { updateUser: User }) => callback(data.updateUser),
                  setError,
                  setSubmitting,
                )
              } else {
                apiMutate(
                  createUser(transfer),
                  (data: { createUser: User }) => callback(data.createUser),
                  setError,
                  setSubmitting,
                )
              }
            } }>
            { ({ isSubmitting }) => (
              <Form className="flex flex-col gap-6">
                <FormikInput name="name" label="Name"/>
                <FormikInput name="email" label="Email"/>
                <FormikInput name="password" label="Password" type="password"/>
                <FormikTags name="permissions" label="Permission" whitelist={ Object.values(Permission) }/>

                { error && <Error text={ error }/> }

                <div>
                  <Button label="Cancel" type="reset" onClick={ handleOpen }/>{ ' ' }
                  <Button
                    icon={ icon }
                    label={ user ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Adding...' : 'Add') }
                    size="md"
                    type="submit"
                    disabled={ isSubmitting }
                  />
                </div>
              </Form>
            ) }
          </Formik>
        </CardBody>
      </Card>
    </Dialog>
  </>
}

export default memo(AddUser)
