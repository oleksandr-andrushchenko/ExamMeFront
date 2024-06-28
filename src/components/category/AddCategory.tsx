import { Button, Card, CardBody, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { PencilSquareIcon as UpdateIcon, PlusIcon as CreateIcon } from '@heroicons/react/24/solid'
import { memo, useState } from 'react'
import Category from '../../schema/category/Category'
import { apiMutate } from '../../api/apolloClient'
import updateCategoryMutation from '../../api/category/updateCategoryMutation'
import createCategoryMutation from '../../api/category/createCategoryMutation'
import Error from '../Error'
import { Form, Formik, FormikHelpers } from 'formik'
import * as yup from 'yup'
import FormikTextarea from '../formik/FormikTextarea'
import FormikInput from '../formik/FormikInput'

interface Props {
  category?: Category
  onSubmit?: (question: Category) => void
  iconButton?: boolean
}

interface Form {
  name: string
  requiredScore: number
}

const AddCategory = ({ category, onSubmit, iconButton }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')

  const icon = category ? <UpdateIcon className="inline-block h-4 w-4"/> :
    <CreateIcon className="inline-block h-4 w-4"/>
  const label = category ? 'Update category' : 'Add category'

  return <>
    { iconButton
      ? <Tooltip content={ label }>
        <IconButton onClick={ handleOpen }>{ icon }</IconButton>
      </Tooltip>
      : <Button onClick={ handleOpen }>{ icon } { label }</Button> }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4">
            { category ? 'Update category' : 'Add category' }
          </Typography>
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
              const transfer = {
                name: values.name,
                requiredScore: values.requiredScore,
              }
              const callback = (category: Category) => {
                setOpen(false)
                onSubmit && onSubmit(category)
              }

              if (category) {
                apiMutate<{ updateCategory: Category }>(
                  updateCategoryMutation(category.id!, transfer),
                  data => callback(data.updateCategory),
                  setError,
                  setSubmitting,
                )
              } else {
                apiMutate<{ createCategory: Category }>(
                  createCategoryMutation(transfer),
                  data => callback(data.createCategory),
                  setError,
                  setSubmitting,
                )
              }
            } }>
            { ({ isSubmitting }) => (
              <Form className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <FormikTextarea name="name" label="Name"/>
                </div>

                <div className="flex flex-col gap-2">
                  <FormikInput name="requiredScore" type="number" label="Required score"/>
                </div>

                { error && <Error text={ error }/> }

                <div>
                  <Button type="reset" onClick={ handleOpen }>
                    Cancel
                  </Button>
                  <Button size="md" className="ml-1" type="submit" disabled={ isSubmitting }>
                    { category ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Adding...' : 'Add') }
                  </Button>
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
