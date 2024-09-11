import { Card, CardBody, Dialog } from '@material-tailwind/react'
import { ComponentProps, memo, useState } from 'react'
import Category from '../../schema/category/Category'
import { apiMutate } from '../../api/apolloClient'
import updateCategory from '../../api/category/updateCategory'
import createCategory from '../../api/category/createCategory'
import Error from '../Error'
import { Form, Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'
import FormikTextarea from '../formik/FormikTextarea'
import FormikInput from '../formik/FormikInput'
import { CreateIcon, EditIcon } from '../../registry/icons'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import useAuth from '../../hooks/useAuth'
import Auth from '../Auth'
import CategoryPermission from '../../enum/category/CategoryPermission'
import H3 from '../typography/H3'

interface Props extends ComponentProps<any> {
  category?: Category
  onSubmit?: (question: Category) => void
  iconButton?: boolean
}

interface Form {
  name: string
  requiredScore: number
}

const AddCategory = ({ category, onSubmit, iconButton = false }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')
  const { authenticationToken, checkAuthorization } = useAuth()

  const icon = category ? EditIcon : CreateIcon
  const label = category ? 'Update Category' : 'Add Category'

  if (!authenticationToken) {
    return <Auth
      button={ { icon, label, size: 'sm', iconOnly: iconButton } }
      dialog={ { label: 'You need to be authenticated' } }
      onSubmit={ () => setOpen(true) }
    />
  }

  const buildButton = (props = {}) => {
    if (iconButton) {
      return <IconButton icon={ icon } tooltip={ label } onClick={ handleOpen } { ...props }/>
    }

    return <Button icon={ icon } label={ label } onClick={ handleOpen } { ...props }/>
  }

  const permission = category ? CategoryPermission.Update : CategoryPermission.Create

  if (!checkAuthorization(permission, category)) {
    return buildButton({ disabled: true, tooltip: 'You are not allowed to do this' })
  }

  return <>
    { buildButton() }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <H3 icon={ icon } label={ label }/>
          <Formik
            initialValues={ {
              name: category?.name || '',
              requiredScore: category?.requiredScore || 0,
            } }
            validationSchema={ yup.object({
              name: yup.string()
                .min(3, 'Name must be at least 3 characters')
                .max(100, 'Name cannot exceed 100 characters')
                .matches(/^[a-zA-Z]/, 'Name must start with a letter')
                .required('Name is required'),
              requiredScore: yup.number()
                .min(0, 'Score must be at least 0')
                .max(100, 'Score cannot exceed 100')
                .optional(),
            }) }
            onSubmit={ (values, { setSubmitting }: FormikHelpers<Form>) => {
              setError('')

              const transfer = {
                name: values.name,
                requiredScore: values.requiredScore,
              }
              const callback = (category: Category) => {
                setOpen(false)
                onSubmit && onSubmit(category)
              }

              if (category) {
                apiMutate(
                  updateCategory(category.id!, transfer),
                  (data: { updateCategory: Category }) => callback(data.updateCategory),
                  setError,
                  setSubmitting,
                )
              } else {
                apiMutate(
                  createCategory(transfer),
                  (data: { createCategory: Category }) => callback(data.createCategory),
                  setError,
                  setSubmitting,
                )
              }
            } }>
            { ({ isSubmitting }) => (
              <Form className="flex flex-col gap-6">

                <FormikTextarea name="name" label="Name"/>
                <FormikInput name="requiredScore" type="number" label="Required score"/>

                { error && <Error text={ error }/> }

                <div>
                  <Button label="Cancel" type="reset" onClick={ handleOpen }/>{ ' ' }
                  <Button
                    icon={ icon }
                    label={ category ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Adding...' : 'Add') }
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

export default memo(AddCategory)
