import { Button, Card, CardBody, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { PencilSquareIcon as UpdateIcon, PlusIcon as CreateIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import QuestionTransfer, {
  QuestionChoice,
  QuestionDifficulty,
  QuestionType,
} from '../../schema/question/QuestionTransfer'
import Question from '../../schema/question/Question'
import Category from '../../schema/category/Category'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import updateQuestionMutation from '../../api/question/updateQuestionMutation'
import createQuestionMutation from '../../api/question/createQuestionMutation'
import categoriesSelectQuery from '../../api/category/categoriesSelectQuery'
import Spinner from '../Spinner'
import Error from '../Error'
import * as yup from 'yup'
import { FieldArray, Form, Formik, FormikHelpers } from 'formik'
import QuestionUpdateTransfer from '../../schema/question/QuestionUpdateTransfer'
import FormikTextarea from '../formik/FormikTextarea'
import FormikSelect from '../formik/FormikSelect'
import FormikInput from '../formik/FormikInput'
import FormikCheckbox from '../formik/FormikCheckbox'

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

  useEffect(() => {
    if (!category && !question) {
      apiQuery<{ categories: Category[] }>(
        categoriesSelectQuery(),
        data => setCategories(data.categories),
        setError,
        setLoading,
      )
    }
  }, [])

  const icon = question ? <UpdateIcon className="inline-block h-4 w-4"/> :
    <CreateIcon className="inline-block h-4 w-4"/>
  const label = question ? 'Update question' : 'Add question'

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
            { question ? 'Update question' : 'Add question' }
          </Typography>
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
                apiMutate<{ updateQuestion: Question }>(
                  updateQuestionMutation(question.id!, transfer as QuestionUpdateTransfer),
                  data => callback(data.updateQuestion),
                  setError,
                  setSubmitting,
                )
              } else {
                apiMutate<{ createQuestion: Question }>(
                  createQuestionMutation(transfer as QuestionTransfer),
                  data => callback(data.createQuestion),
                  setError,
                  setSubmitting,
                )
              }
            } }>
            { ({ values, isSubmitting }) => (
              <Form className="flex flex-col gap-6">
                { !category && !question && (!categories ? <Spinner type="button"/> : (
                  <div className="flex flex-col gap-2">
                    <FormikSelect
                      name="categoryId"
                      label="Category"
                      options={ categories.map(category => ({ value: category.id, label: category.name })) }
                    />
                  </div>
                )) }

                <div className="flex flex-col gap-2">
                  <FormikTextarea name="title"/>
                </div>

                <div className="flex flex-col gap-2 hidden">
                  <FormikSelect
                    name="type"
                    options={ Object.values(QuestionType).map(type => ({ value: type, label: type })) }
                  />
                </div>

                { values.type === QuestionType.CHOICE && (
                  <FieldArray name="choices">
                    { ({ remove, push }) => (
                      <div className="flex flex-col gap-6">
                        { values.choices.map((choice, index) => (
                          <div key={ `choices.${ index }` } className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                              <FormikInput name={ `choices.${ index }.title` }>
                                [{ index + 1 }] Choice title
                              </FormikInput>
                            </div>
                            <div className="flex flex-col gap-1">
                              <FormikTextarea name={ `choices.${ index }.explanation` }>
                                [{ index + 1 }] Choice explanation
                              </FormikTextarea>
                            </div>
                            <div className="flex flex-col gap-1 -mt-3">
                              <FormikCheckbox name={ `choices.${ index }.correct` }>
                                [{ index + 1 }] Choice correct
                              </FormikCheckbox>
                            </div>
                            { values.choices.length > 1 && (
                              <Button type="button" className="-mt-3" onClick={ () => remove(index) }>
                                <XMarkIcon className="inline-block h-4 w-4"/> Remove
                              </Button>
                            ) }
                          </div>
                        )) }
                        <Button type="button" className="-mt-3" onClick={ () => push(new QuestionChoice()) }>
                          <CreateIcon className="inline-block h-4 w-4"/> Add
                        </Button>
                      </div>
                    ) }
                  </FieldArray>
                ) }

                <div className="flex flex-col gap-2">
                  <FormikSelect
                    name="difficulty"
                    options={ Object.values(QuestionDifficulty).map(difficulty => ({
                      value: difficulty,
                      label: difficulty,
                    })) }
                  />
                </div>

                { error && <Error text={ error }/> }

                <div>
                  <Button type="reset" onClick={ handleOpen }>
                    Cancel
                  </Button>
                  <Button size="md" className="ml-1" type="submit" disabled={ isSubmitting }>
                    { question ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Adding...' : 'Add') }
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

export default memo(AddQuestion)