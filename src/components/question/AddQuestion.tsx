import { Button, Card, CardBody, Dialog, IconButton, Tooltip, Typography } from '@material-tailwind/react'
import { PencilSquareIcon as UpdateIcon, PlusIcon as CreateIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import QuestionTransfer, {
  QuestionAnswer,
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
  Title: string
  Type: QuestionType | ''
  CategoryId: string
  Difficulty: QuestionDifficulty | ''
  Answers: QuestionAnswer[]
  Choices: QuestionChoice[]
}

export default function AddQuestion({ category, question, onSubmit, iconButton }: Props) {
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

  // todo:

  return <>
    { iconButton
      ? (
        <Tooltip content={ label }>
          <IconButton onClick={ handleOpen }>{ icon }</IconButton>
        </Tooltip>
      )
      : (
        <Button onClick={ handleOpen }>{ icon } { label }</Button>
      ) }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4">
            { question ? 'Update question' : 'Add question' }
          </Typography>
          <Formik
            initialValues={ {
              Title: question?.title || '',
              Type: question?.type || '',
              CategoryId: question?.categoryId || '',
              Difficulty: question?.difficulty || '',
              Answers: question?.answers || [ new QuestionAnswer() ],
              Choices: question?.choices || [ new QuestionChoice() ],
            } }
            validationSchema={ yup.object({
              Title: yup.string().min(10).max(300).matches(/^[a-zA-Z]/).required(),
              // todo: oneOf
              CategoryId: category || question ? yup.string().optional() : yup.lazy(_ => {
                if (categories) {
                  return yup.string().oneOf(categories.map(category => category.id)).required()
                }

                return yup.string().required()
              }),
              Type: yup.string().oneOf(Object.values(QuestionType)).required(),
              Difficulty: yup.string().oneOf(Object.values(QuestionDifficulty)).required(),
              Answers: yup.mixed().when('Type', {
                is: QuestionType.TYPE,
                then: () => yup.array().of(
                  yup.object().shape({
                    variants: yup.string().min(2).matches(/^[a-zA-Z0-9]/).required(),
                    explanation: yup.lazy((value) => {
                      if (!!value) {
                        return yup.string().min(10).max(3000).matches(/^[a-zA-Z]/)
                      }

                      return yup.string().nullable().optional()
                    }),
                    correct: yup.boolean(),
                  }),
                ),
              }),
              Choices: yup.mixed().when('Type', {
                is: QuestionType.CHOICE,
                then: () => yup.array().of(
                  yup.object().shape({
                    title: yup.string().min(10).max(3000).matches(/^[a-zA-Z]/).required(),
                    explanation: yup.lazy((value) => {
                      if (!!value) {
                        return yup.string().min(10).max(3000).matches(/^[a-zA-Z]/)
                      }

                      return yup.string().nullable().optional()
                    }),
                    correct: yup.boolean(),
                  }),
                ),
              }),
            }) }
            onSubmit={ (values, { setSubmitting }: FormikHelpers<Form>) => {
              const transfer = {
                categoryId: category?.id || question?.categoryId || values.CategoryId || '',
                title: values.Title,
                type: values.Type,
                difficulty: values.Difficulty,
                answers: values.Answers,
                choices: values.Choices,
              }

              const callback = (question: Question) => {
                setSubmitting(false)
                setOpen(false)
                onSubmit && onSubmit(question)
              }

              if (question) {
                apiMutate<{ updateQuestion: Question }>(
                  updateQuestionMutation(question.id!, transfer as QuestionUpdateTransfer),
                  data => callback(data.updateQuestion),
                  setError,
                )
              } else {
                apiMutate<{ createQuestion: Question }>(
                  createQuestionMutation(transfer as QuestionTransfer),
                  data => callback(data.createQuestion),
                  setError,
                )
              }
            } }>
            { ({ values, errors, isSubmitting }) => {
              // todo: remove
              console.log(values, errors)
              return (
                <Form className="flex flex-col gap-6">
                  { !category && !question && (!categories ? <Spinner type="button"/> : (
                    <div className="flex flex-col gap-2">
                      <FormikSelect
                        name="CategoryId"
                        label="Category"
                        options={ categories.map(category => ({ value: category.id, label: category.name })) }/>
                    </div>
                  )) }

                  <div className="flex flex-col gap-2">
                    <FormikTextarea name="Title"/>
                  </div>

                  <div className="flex flex-col gap-2">
                    <FormikSelect
                      name="Type"
                      options={ Object.values(QuestionType).map(type => ({ value: type, label: type })) }/>
                  </div>

                  { values.Type === QuestionType.TYPE && (
                    <FieldArray name="Answers">
                      { ({ remove, push }) => (
                        <div className="flex flex-col gap-6">
                          { values.Answers.map((answer, index) => (
                            <div key={ `Answers.${ index }` } className="flex flex-col gap-3">
                              <div className="flex flex-col gap-1">
                                <FormikInput name={ `Answers.${ index }.variants` }>
                                  [{ index + 1 }] variants (separated by comma)
                                </FormikInput>
                              </div>
                              <div className="flex flex-col gap-1">
                                <FormikTextarea name={ `Answers.${ index }.explanation` }>
                                  [{ index + 1 }] explanation
                                </FormikTextarea>
                              </div>
                              <div className="flex flex-col gap-1 -mt-3">
                                <FormikCheckbox name={ `Answers.${ index }.correct` }>
                                  [{ index + 1 }] Answer correct
                                </FormikCheckbox>
                              </div>
                              { values.Answers.length > 0 && (
                                <Button type="button" className="-mt-3" onClick={ () => remove(index) }>
                                  <XMarkIcon className="inline-block h-4 w-4"/> Remove
                                </Button>
                              ) }
                            </div>
                          )) }
                          <Button type="button" className="-mt-3" onClick={ () => push(new QuestionAnswer()) }>
                            <CreateIcon className="inline-block h-4 w-4"/> Add
                          </Button>
                        </div>
                      ) }
                    </FieldArray>
                  ) }

                  { values.Type === QuestionType.CHOICE && (
                    <FieldArray name="Choices">
                      { ({ remove, push }) => (
                        <div className="flex flex-col gap-6">
                          { values.Choices.map((choice, index) => (
                            <div key={ `Choices.${ index }` } className="flex flex-col gap-3">
                              <div className="flex flex-col gap-1">
                                <FormikInput name={ `Choices.${ index }.title` }>
                                  [{ index + 1 }] Choice title
                                </FormikInput>
                              </div>
                              <div className="flex flex-col gap-1">
                                <FormikTextarea name={ `Choices.${ index }.explanation` }>
                                  [{ index + 1 }] Choice explanation
                                </FormikTextarea>
                              </div>
                              <div className="flex flex-col gap-1 -mt-3">
                                <FormikCheckbox name={ `Choices.${ index }.correct` }>
                                  [{ index + 1 }] Choice correct
                                </FormikCheckbox>
                              </div>
                              { values.Choices.length > 1 && (
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
                      name="Difficulty"
                      options={ Object.values(QuestionDifficulty).map(difficulty => ({
                        value: difficulty,
                        label: difficulty,
                      })) }/>
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
              )
            } }
          </Formik>
        </CardBody>
      </Card>
    </Dialog>
  </>
}