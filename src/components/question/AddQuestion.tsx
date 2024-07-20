import { Card, CardBody, Dialog, Typography } from '@material-tailwind/react'
import { memo, useEffect, useState } from 'react'
import CreateQuestion, { QuestionChoice, QuestionDifficulty, QuestionType } from '../../schema/question/CreateQuestion'
import Question from '../../schema/question/Question'
import Category from '../../schema/category/Category'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import getCategoriesForSelect from '../../api/category/getCategoriesForSelect'
import createQuestion from '../../api/question/createQuestion'
import updateQuestion from '../../api/question/updateQuestion'
import Spinner from '../Spinner'
import Error from '../Error'
import * as yup from 'yup'
import { FieldArray, Form, Formik, FormikHelpers } from 'formik'
import UpdateQuestion from '../../schema/question/UpdateQuestion'
import FormikTextarea from '../formik/FormikTextarea'
import FormikSelect from '../formik/FormikSelect'
import FormikInput from '../formik/FormikInput'
import FormikCheckbox from '../formik/FormikCheckbox'
import { CreateIcon, DeleteIcon, EditIcon } from '../../registry/icons'
import IconButton from '../elements/IconButton'
import Button from '../elements/Button'
import useAuth from '../../hooks/useAuth'
import Auth from '../Auth'
import QuestionPermission from '../../enum/question/QuestionPermission'

interface Props {
  category?: Category
  question?: Question
  onSubmit?: (question: Question) => void
  iconButton?: boolean
}

interface Form {
  title: string
  type: QuestionType
  categoryId: string
  difficulty: QuestionDifficulty | ''
  choices: QuestionChoice[]
}

const AddQuestion = ({ category, question, onSubmit, iconButton }: Props) => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ categories, setCategories ] = useState<Category[]>()
  const handleOpen = () => setOpen(!open)
  const [ _, setLoading ] = useState<boolean>(true)
  const [ error, setError ] = useState<string>('')
  const { authenticationToken, checkAuthorization } = useAuth()

  useEffect(() => {
    if (!category && !question) {
      apiQuery(
        getCategoriesForSelect(),
        (data: { categories: Category[] }) => setCategories(data.categories),
        setError,
        setLoading,
      )
    }
  }, [])

  const icon = question ? EditIcon : CreateIcon
  const label = question ? 'Update Question' : 'Add Question'

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

  const permission = question ? QuestionPermission.Update : QuestionPermission.Create

  if (!checkAuthorization(permission, question)) {
    return buildButton({ disabled: true, tooltip: 'You are not allowed to do this' })
  }

  return <>
    { buildButton() }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4">{ label }</Typography>
          <Formik
            initialValues={ {
              title: question?.title || '',
              type: question?.type || QuestionType.CHOICE,
              categoryId: question?.categoryId || '',
              difficulty: question?.difficulty || '',
              choices: question?.choices || [ new QuestionChoice() ],
            } }
            validationSchema={ yup.object({
              title: yup.string()
                .min(10, 'Title must be at least 10 characters')
                .max(300, 'Title cannot exceed 300 characters')
                .matches(/^[a-zA-Z]/, 'Title must start with a letter')
                .required('Title is required'),
              categoryId: category || question ? yup.string().optional() : yup.lazy(_ => {
                if (categories) {
                  return yup.string()
                    .oneOf(categories.map(category => category.id))
                    .required('Category is required')
                }

                return yup.string().required('Category is required')
              }),
              type: yup.string()
                .oneOf(Object.values(QuestionType))
                .required('Type is required'),
              difficulty: yup.string()
                .oneOf(Object.values(QuestionDifficulty))
                .required('Difficulty is required'),
              choices: yup.mixed().when('type', {
                is: QuestionType.CHOICE,
                then: () => yup.array().of(
                  yup.object().shape({
                    title: yup.string()
                      .min(10, 'Choice title must be at least 10 characters')
                      .max(3000, 'Choice title cannot exceed 3000 characters')
                      .matches(/^[a-zA-Z]/, 'Choice title must start with a letter')
                      .required('Choice title is required'),
                    explanation: yup.lazy((value) => {
                      if (!!value) {
                        return yup.string()
                          .min(10, 'Choice explanation must be at least 10 characters')
                          .max(3000, 'Choice explanation cannot exceed 3000 characters')
                          .matches(/^[a-zA-Z]/, 'Explanation must start with a letter')
                      }

                      return yup.string()
                        .nullable()
                        .optional()
                    }),
                    correct: yup.boolean(),
                  }),
                ),
              }),
            }) }
            onSubmit={ (values, { setSubmitting }: FormikHelpers<Form>) => {
              const transfer = {
                categoryId: category?.id || question?.categoryId || values.categoryId || '',
                title: values.title,
                type: values.type,
                difficulty: values.difficulty,
                choices: values.choices.map(choice => {
                  if (!choice.explanation) {
                    delete choice.explanation
                  }

                  return choice
                }),
              }

              const callback = (question: Question) => {
                setOpen(false)
                onSubmit && onSubmit(question)
              }

              if (question) {
                apiMutate(
                  updateQuestion(question.id!, transfer as UpdateQuestion),
                  (data: { updateQuestion: Question }) => callback(data.updateQuestion),
                  setError,
                  setSubmitting,
                )
              } else {
                apiMutate(
                  createQuestion(transfer as CreateQuestion),
                  (data: { createQuestion: Question }) => callback(data.createQuestion),
                  setError,
                  setSubmitting,
                )
              }
            } }>
            { ({ values, isSubmitting }) => (
              <Form className="flex flex-col gap-6">
                { !category && !question && (!categories ? <Spinner type="button"/> : (
                  <FormikSelect
                    name="categoryId"
                    label="Category"
                    options={ categories.map(category => ({ value: category.id, label: category.name })) }
                  />
                )) }

                <FormikTextarea name="title"/>

                <FormikSelect
                  name="type"
                  options={ Object.values(QuestionType).map(type => ({ value: type, label: type })) }
                />

                { values.type === QuestionType.CHOICE && (
                  <FieldArray name="choices">
                    { ({ remove, push }) => (
                      <div className="flex flex-col gap-6">
                        { values.choices.map((choice, index) => (
                          <div key={ `choices.${ index }` } className="flex flex-col gap-3">

                            <FormikInput name={ `choices.${ index }.title` }>
                              [{ index + 1 }] Choice title
                            </FormikInput>

                            <FormikTextarea name={ `choices.${ index }.explanation` }>
                              [{ index + 1 }] Choice explanation
                            </FormikTextarea>

                            <FormikCheckbox name={ `choices.${ index }.correct` }>
                              [{ index + 1 }] Choice correct
                            </FormikCheckbox>

                            { values.choices.length > 1 && (
                              <Button
                                icon={ DeleteIcon }
                                label="Remove"
                                className="-mt-3"
                                onClick={ () => remove(index) }
                              />
                            ) }
                          </div>
                        )) }
                        <Button
                          icon={ CreateIcon }
                          label="Add"
                          type="button"
                          className="-mt-3"
                          onClick={ () => push(new QuestionChoice()) }
                        />
                      </div>
                    ) }
                  </FieldArray>
                ) }

                <FormikSelect
                  name="difficulty"
                  options={ Object.values(QuestionDifficulty).map(difficulty => ({
                    value: difficulty,
                    label: difficulty,
                  })) }
                />

                { error && <Error text={ error }/> }

                <div>
                  <Button label="Cancel" type="reset" onClick={ handleOpen }/>{ ' ' }
                  <Button
                    icon={ icon }
                    label={ question ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Adding...' : 'Add') }
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

export default memo(AddQuestion)