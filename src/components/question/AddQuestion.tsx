import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Dialog,
  IconButton,
  Input,
  Option,
  Select,
  Textarea,
  Tooltip,
  Typography,
} from '@material-tailwind/react'
import { PencilSquareIcon as UpdateIcon, PlusIcon as CreateIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import InputState, { defaultInputState } from '../../schema/InputState'
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

interface Props {
  category?: Category
  question?: Question
  onSubmit?: (question: Question) => void
  iconButton?: boolean
}

type AnswerInputState = {
  [key in keyof QuestionAnswer]: InputState
}

type ChoiceInputState = {
  [key in keyof QuestionChoice]: InputState
}

export default function AddQuestion({ category, question, onSubmit, iconButton }: Props) {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
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

  const [ title, setTitle ] = useState<InputState>({ ...defaultInputState, ...{ value: question?.title } })
  const getTitleError = (value: string | undefined = undefined): string => {
    value = value === undefined ? title.value : value

    if (!value) {
      return 'Should not be empty'
    }

    if (value.length < 10 || value.length > 3000) {
      return 'Should be from 10 to 3000 characters long'
    }

    if (value && !/^[a-zA-Z]/.test(value)) {
      return 'Should have letters'
    }

    return ''
  }
  const setTitleValue = (value: string) => {
    const error = getTitleError(value)
    setTitle({ ...title, ...{ value, error } })
  }
  const setTitleFocused = (focused: boolean) => {
    const error = focused ? title.error : getTitleError()
    const displayError = error && !focused ? true : title.displayError
    setTitle({ ...title, ...{ focused, error, displayError } })
  }
  const setTitleError = (error: string) => {
    const displayError = !!error
    setTitle({ ...title, ...{ error, displayError } })
  }

  const [ categoryId, setCategoryId ] = useState<InputState>({ ...defaultInputState })
  const getCategoryIdError = (value: string | undefined = undefined): string => {
    value = value === undefined ? categoryId.value : value

    if (!value) {
      return 'Should not be empty'
    }

    return ''
  }
  const setCategoryIdValue = (value: string) => {
    const error = getCategoryIdError(value)
    setCategoryId({ ...categoryId, ...{ value, error } })
  }
  const setCategoryIdFocused = (focused: boolean) => {
    const error = focused ? categoryId.error : getCategoryIdError()
    const displayError = error && !focused ? true : categoryId.displayError
    setCategoryId({ ...categoryId, ...{ focused, error, displayError } })
  }
  const setCategoryIdError = (error: string) => {
    const displayError = !!error
    setCategoryId({ ...categoryId, ...{ error, displayError } })
  }

  const [ type, setType ] = useState<InputState>({ ...defaultInputState, ...{ value: QuestionType.CHOICE } })
  const getTypeError = (value: string | undefined = undefined): string => {
    value = value === undefined ? type.value : value

    if (!value) {
      return 'Should not be empty'
    }

    return ''
  }
  const setTypeValue = (value: string) => {
    const error = getTypeError(value)
    setType({ ...type, ...{ value, error } })
  }
  const setTypeFocused = (focused: boolean) => {
    const error = focused ? type.error : getTypeError()
    const displayError = error && !focused ? true : type.displayError
    setType({ ...type, ...{ focused, error, displayError } })
  }
  const setTypeError = (error: string) => {
    const displayError = !!error
    setType({ ...type, ...{ error, displayError } })
  }

  const defaultAnswerInputState = {
    variants: { ...defaultInputState },
    correct: { value: false },
    explanation: { ...defaultInputState },
  } as AnswerInputState
  const defaultAnswers = question && question.type === QuestionType.TYPE
    ? (question?.answers ?? []).map((answer: QuestionAnswer): AnswerInputState => {
      return {
        ...defaultAnswerInputState,
        ...{ variants: { value: answer.variants.join(', ') } },
        ...{ correct: { value: answer.correct } },
        ...{ explanation: { value: answer?.explanation || '' } },
      } as any
    })
    : [ { ...defaultAnswerInputState } ]
  const [ answers, setAnswers ] = useState<AnswerInputState[]>(defaultAnswers)
  const [ answersError, setAnswersError ] = useState<string>('')
  const setAnswer = (index: number, prop: string, key: string, value: any) => {
    const tmp = answers.slice()
    // @ts-ignore
    tmp[index][prop][key] = value
    setAnswers(tmp)
  }
  const getAnswerVariantsError = (index: number, value: string | undefined = undefined): string => {
    value = value === undefined ? answers[index]['variants'].value : value

    if (!value) {
      return 'Should not be empty'
    }

    if (value.length < 2) {
      return 'Should be from 2 characters long'
    }

    if (value && !/^[a-zA-Z0-9]/.test(value)) {
      return 'Should have letters or numbers'
    }

    return ''
  }
  const setAnswerVariantsValue = (index: number, value: string) => {
    const tmp = answers.slice()
    const old: InputState = tmp[index]['variants']
    const error = getAnswerVariantsError(index, value)
    tmp[index]['variants'] = { ...old, ...{ value, error } }
    setAnswers(tmp)
  }
  const setAnswerVariantsFocused = (index: number, focused: boolean) => {
    const tmp = answers.slice()
    const old: InputState = tmp[index]['variants']
    const error = focused ? old.error : getAnswerVariantsError(index)
    const displayError = error && !focused ? true : old.displayError
    tmp[index]['variants'] = { ...old, ...{ focused, error, displayError } }
    setAnswers(tmp)
  }
  const getAnswerExplanationError = (index: number, value: string | undefined = undefined): string => {
    value = value === undefined ? answers[index]['explanation']?.value : value

    if (value && (value.length < 10 || value.length > 3000)) {
      return 'Should be from 10 to 3000 characters long'
    }

    if (value && !/^[a-zA-Z]/.test(value)) {
      return 'Should have letters'
    }

    return ''
  }
  const setAnswerExplanationValue = (index: number, value: any) => {
    const tmp = answers.slice()
    const old: InputState = tmp[index]['explanation']!
    const error = getAnswerExplanationError(index, value)
    tmp[index]['explanation'] = { ...old, ...{ value, error } }
    setAnswers(tmp)
  }
  const setAnswerExplanationFocused = (index: number, focused: boolean) => {
    const tmp = answers.slice()
    const old: InputState = tmp[index]['explanation']!
    const error = focused ? old.error : getAnswerExplanationError(index)
    const displayError = error && !focused ? true : old.displayError
    tmp[index]['explanation'] = { ...old, ...{ focused, error, displayError } }
    setAnswers(tmp)
  }
  const setAnswerCorrect = (index: number, key: string, value: any) => setAnswer(index, 'correct', key, value)
  const addAnswer = () => {
    const tmp = answers.slice()
    tmp.push({ ...defaultAnswerInputState })
    setAnswers(tmp)
  }
  const removeAnswer = (index: number) => {
    const tmp = answers.slice()
    tmp.splice(index, 1)
    setAnswers(tmp)
  }

  const defaultChoiceInputState = {
    title: { ...defaultInputState },
    correct: { value: false },
    explanation: { ...defaultInputState },
  } as ChoiceInputState
  const defaultChoices = question && question.type === QuestionType.CHOICE
    ? (question?.choices ?? []).map((choice: QuestionChoice): ChoiceInputState => {
      return {
        ...defaultChoiceInputState,
        ...{ title: { value: choice.title } },
        ...{ correct: { value: choice.correct } },
        ...{ explanation: { value: choice?.explanation || '' } },
      } as any
    })
    : [ { ...defaultChoiceInputState } ]
  const [ choices, setChoices ] = useState<ChoiceInputState[]>(defaultChoices)
  const [ choicesError, setChoicesError ] = useState<string>('')
  const setChoice = (index: number, prop: string, key: string, value: any) => {
    const tmp = choices.slice()
    // @ts-ignore
    tmp[index][prop][key] = value
    setChoices(tmp)
  }
  const getChoiceTitleError = (index: number, value: string | undefined = undefined): string => {
    value = value === undefined ? choices[index]['title'].value : value

    if (!value) {
      return 'Should not be empty'
    }

    if (value.length < 10 || value.length > 3000) {
      return 'Should be from 10 to 3000 characters long'
    }

    if (value && !/^[a-zA-Z]/.test(value)) {
      return 'Should have letters'
    }

    return ''
  }
  const setChoiceTitleValue = (index: number, value: string) => {
    const tmp = choices.slice()
    const old: InputState = tmp[index]['title']
    const error = getChoiceTitleError(index, value)
    tmp[index]['title'] = { ...old, ...{ value, error } }
    setChoices(tmp)
  }
  const setChoiceTitleFocused = (index: number, focused: boolean) => {
    const tmp = choices.slice()
    const old: InputState = tmp[index]['title']
    const error = focused ? old.error : getChoiceTitleError(index)
    const displayError = error && !focused ? true : old.displayError
    tmp[index]['title'] = { ...old, ...{ focused, error, displayError } }
    setChoices(tmp)
  }
  const getChoiceExplanationError = (index: number, value: string | undefined = undefined): string => {
    value = value === undefined ? choices[index]['explanation']?.value : value

    if (value && (value.length < 10 || value.length > 3000)) {
      return 'Should be from 10 to 3000 characters long'
    }

    if (value && !/^[a-zA-Z]/.test(value)) {
      return 'Should have letters'
    }

    return ''
  }
  const setChoiceExplanationValue = (index: number, value: any) => {
    const tmp = choices.slice()
    const old: InputState = tmp[index]['explanation']!
    const error = getChoiceExplanationError(index, value)
    tmp[index]['explanation'] = { ...old, ...{ value, error } }
    setChoices(tmp)
  }
  const setChoiceExplanationFocused = (index: number, focused: boolean) => {
    const tmp = choices.slice()
    const old: InputState = tmp[index]['explanation']!
    const error = focused ? old.error : getChoiceExplanationError(index)
    const displayError = error && !focused ? true : old.displayError
    tmp[index]['explanation'] = { ...old, ...{ focused, error, displayError } }
    setChoices(tmp)
  }
  const setChoiceCorrect = (index: number, key: string, value: any) => setChoice(index, 'correct', key, value)
  const addChoice = () => {
    const tmp = choices.slice()
    tmp.push({ ...defaultChoiceInputState })
    setChoices(tmp)
  }
  const removeChoice = (index: number) => {
    const tmp = choices.slice()
    tmp.splice(index, 1)
    setChoices(tmp)
  }

  const [ difficulty, setDifficulty ] = useState<InputState>({ ...defaultInputState, ...{ value: question?.difficulty } })
  const getDifficultyError = (value: string | undefined = undefined): string => {
    value = value === undefined ? difficulty.value : value

    if (!value) {
      return 'Should not be empty'
    }

    return ''
  }
  const setDifficultyValue = (value: string) => {
    const error = getDifficultyError(value)
    setDifficulty({ ...difficulty, ...{ value, error } })
  }
  const setDifficultyFocused = (focused: boolean) => {
    const error = focused ? difficulty.error : getDifficultyError()
    const displayError = error && !focused ? true : difficulty.displayError
    setDifficulty({ ...difficulty, ...{ focused, error, displayError } })
  }
  const setDifficultyError = (error: string) => {
    const displayError = !!error
    setDifficulty({ ...difficulty, ...{ error, displayError } })
  }

  const [ disabled, setDisabled ] = useState<boolean>(true)

  const isDisabled = (): boolean => {
    const invalid = !title.value || title.error
      || !type.value || type.error
      || !difficulty.value || difficulty.error
      || (!category && !question && (!categoryId.value || categoryId.error))
      || processing

    if (invalid) {
      return true
    }

    if (type.value === QuestionType.TYPE) {
      const invalidAnswers = answers.filter((answer: AnswerInputState): boolean => {
        if (!answer.variants.value || answer.variants.error) {
          return true
        }

        return !!(answer.explanation?.value && answer.explanation?.error)
      })

      if (invalidAnswers.length > 0) {
        return true
      }
    }

    if (type.value === QuestionType.CHOICE) {
      const invalidChoices = choices.filter((choice: ChoiceInputState): boolean => {
        if (!choice.title.value || choice.title.error) {
          return true
        }

        return !!(choice.explanation?.value && choice.explanation?.error)
      })

      if (invalidChoices.length > 0) {
        return true
      }
    }

    return false
  }
  const validate = (): boolean => {
    if (type.value === QuestionType.TYPE) {
      const correct = answers.filter((answer: AnswerInputState): boolean => !!answer.correct.value)

      if (correct.length === 0) {
        setAnswersError('At least one correct answer should be there')
        return false
      }
    }

    if (type.value === QuestionType.CHOICE) {
      const correct = choices.filter((choice: ChoiceInputState): boolean => !!choice.correct.value)

      if (correct.length === 0) {
        setChoicesError('At least one correct choice should be there')
        return false
      }
    }

    return true
  }
  const handleSubmit = async (e): Promise<void> => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setProcessing(true)

    const transfer: QuestionTransfer = {
      categoryId: category?.id || question?.categoryId || categoryId?.value || '',
      title: title.value,
      type: type.value,
      difficulty: difficulty.value,
    }

    if (type.value === QuestionType.TYPE) {
      transfer.answers = answers.map((answer: AnswerInputState): QuestionAnswer => {
        const answerTransfer: QuestionAnswer = {
          variants: answer.variants.value.split(',').map((variant: string): string => variant.trim()),
          correct: answer.correct.value,
        }

        if (answer.explanation?.value) {
          answerTransfer['explanation'] = answer.explanation.value
        }

        return answerTransfer
      })
    }

    if (type.value === QuestionType.CHOICE) {
      transfer.choices = choices.map((choice: ChoiceInputState): QuestionChoice => {
        const choiceTransfer: QuestionChoice = {
          title: choice.title.value,
          correct: choice.correct.value,
        }

        if (choice.explanation?.value) {
          choiceTransfer['explanation'] = choice.explanation.value
        }

        return choiceTransfer
      })
    }

    const callback = (affectedQuestion: Question) => {
      if (!question) {
        setCategoryId({ ...defaultInputState })
        setTitle({ ...defaultInputState })
        setType({ ...defaultInputState, ...{ value: QuestionType.CHOICE } })
        setAnswers([ { ...defaultAnswerInputState } ])
        setChoices([ { ...defaultChoiceInputState } ])
        setDifficulty({ ...defaultInputState })
      }

      setOpen(false)
      onSubmit && onSubmit(affectedQuestion)
    }

    if (question) {
      apiMutate<{ updateQuestion: Question }>(
        updateQuestionMutation(question.id!, transfer),
        data => callback(data.updateQuestion),
        setError,
        setProcessing,
      )
    } else {
      apiMutate<{ createQuestion: Question }>(
        createQuestionMutation(transfer),
        data => callback(data.createQuestion),
        setError,
        setProcessing,
      )
    }
  }

  useEffect(() => setDisabled(isDisabled()), [ title, categoryId, type, choices, answers, difficulty ])

  const icon = question ? <UpdateIcon className="inline-block h-4 w-4"/> :
    <CreateIcon className="inline-block h-4 w-4"/>
  const label = question ? 'Update question' : 'Add question'

  return <>
    { iconButton
      ? (
        <Tooltip content={ label }>
          <IconButton onClick={ handleOpen } disabled={ processing }>{ icon }</IconButton>
        </Tooltip>
      )
      : (
        <Button onClick={ handleOpen } disabled={ processing }>{ icon } { label }</Button>
      ) }
    <Dialog open={ open } handler={ handleOpen } className="text-left">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4">
            { question ? 'Update question' : 'Add question' }
          </Typography>
          <form className="flex flex-col gap-6" onSubmit={ handleSubmit } method="post">
            { !category && !question && (!categories ? <Spinner type="button"/> : ((
              <div className="flex flex-col gap-2">
                <Select
                  name="category"
                  label="Category"
                  onChange={ (categoryId) => setCategoryIdValue(categoryId!) }
                  onFocus={ () => setCategoryIdFocused(true) }
                  containerProps={ {
                    onBlur: (e) => !e.nativeEvent.relatedTarget && setCategoryIdFocused(false),
                  } }
                  value={ categoryId.value }
                  aria-invalid={ categoryId.error ? 'true' : 'false' }
                  error={ !!categoryId.error && categoryId.displayError }
                  className="capitalize">
                  { categories.map((category: Category) => (
                    <Option key={ category.id } value={ category.id } className="capitalize">{ category.name }</Option>
                  )) }
                </Select>
                { categoryId.error && categoryId.displayError && <Error text={ categoryId.error }/> }
              </div>
            ))) }

            <div className="flex flex-col gap-2">
              <Textarea
                rows={ 1 }
                resize
                name="title"
                type="text"
                label="Title"
                onChange={ (e) => setTitleValue(e.target.value) }
                onFocus={ () => setTitleFocused(true) }
                onBlur={ () => setTitleFocused(false) }
                value={ title.value }
                aria-invalid={ title.error ? 'true' : 'false' }
                error={ !!title.error && title.displayError }
                required/>
              { title.error && title.displayError && <Error text={ title.error }/> }
            </div>

            <div className="flex flex-col gap-2 hidden">
              <Select
                name="type"
                label="Type"
                onChange={ (type) => setTypeValue(type!) }
                onFocus={ () => setTypeFocused(true) }
                containerProps={ {
                  onBlur: (e) => !e.nativeEvent.relatedTarget && setTypeFocused(false),
                } }
                value={ type.value }
                aria-invalid={ type.error ? 'true' : 'false' }
                error={ !!type.error && type.displayError }
                className="capitalize">
                { Object.values(QuestionType).map((type) => (
                  <Option key={ type } value={ type } className="capitalize">{ type }</Option>
                )) }
              </Select>
              { type.error && type.displayError && <Error text={ type.error }/> }
            </div>

            { type.value === QuestionType.TYPE && (
              <div className="flex flex-col gap-6">
                { answers.map((answer: AnswerInputState, index) => (
                  <div key={ `answer-${ index }` } className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <Input
                        name={ `answer-${ index }-variants` }
                        type="text"
                        label={ `[${ index + 1 }] variants (separated by comma)` }
                        onChange={ (e) => setAnswerVariantsValue(index, e.target.value) }
                        onFocus={ () => setAnswerVariantsFocused(index, true) }
                        onBlur={ () => setAnswerVariantsFocused(index, false) }
                        value={ answer.variants.value }
                        aria-invalid={ answer.variants.error ? 'true' : 'false' }
                        error={ !!answer.variants.error && answer.variants.displayError }
                        required/>
                      { answer.variants.error && answer.variants.displayError &&
                        <Error text={ answer.variants.error }/> }
                    </div>
                    <div className="flex flex-col gap-1">
                      <Textarea
                        rows={ 1 }
                        resize
                        name={ `answer-${ index }-explanation` }
                        type="text"
                        label={ `[${ index + 1 }] explanation` }
                        onChange={ (e) => setAnswerExplanationValue(index, e.target.value) }
                        onFocus={ () => setAnswerExplanationFocused(index, true) }
                        onBlur={ () => setAnswerExplanationFocused(index, false) }
                        value={ answer.explanation?.value }
                        aria-invalid={ answer.explanation?.error ? 'true' : 'false' }
                        error={ !!answer.explanation?.error && answer.explanation?.displayError }/>
                      { answer.explanation?.error && answer.explanation.displayError &&
                        <Error text={ answer.explanation.error }/> }
                    </div>
                    <div className="flex flex-col gap-1 -mt-3">
                      <Checkbox
                        label={ <Typography variant="small">[{ index + 1 }] Answer correct</Typography> }
                        name={ `answer-${ index }-correct` }
                        defaultChecked={ answer.correct.value }
                        onChange={ (e) => setAnswerCorrect(index, 'value', e.target.checked) }/>
                    </div>
                    { answers.length > 1 && (
                      <div className="-mt-3">
                        <Button
                          type="button"
                          onClick={ () => removeAnswer(index) }>
                          <XMarkIcon className="inline-block h-4 w-4"/> Remove
                        </Button>
                      </div>
                    ) }
                  </div>
                )) }
                <div key="control">
                  <Button
                    type="button"
                    onClick={ () => addAnswer() }>
                    <CreateIcon className="inline-block h-4 w-4"/> Add
                  </Button>
                </div>
                { answersError && <Error text={ answersError }/> }
              </div>
            ) }

            { type.value === QuestionType.CHOICE && (
              <div className="flex flex-col gap-6">
                { choices.map((choice: ChoiceInputState, index) => (
                  <div key={ `choice-${ index }` } className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <Textarea
                        rows={ 1 }
                        resize
                        name={ `choice-${ index }-title` }
                        type="text"
                        label={ `[${ index + 1 }] Choice title` }
                        onChange={ (e) => setChoiceTitleValue(index, e.target.value) }
                        onFocus={ () => setChoiceTitleFocused(index, true) }
                        onBlur={ () => setChoiceTitleFocused(index, false) }
                        value={ choice.title.value }
                        aria-invalid={ choice.title.error ? 'true' : 'false' }
                        error={ !!choice.title.error && choice.title.displayError }
                        required/>
                      { choice.title.error && choice.title.displayError && <Error text={ choice.title.error }/> }
                    </div>
                    <div className="flex flex-col gap-1">
                      <Textarea
                        rows={ 1 }
                        resize
                        name={ `choice-${ index }-explanation` }
                        type="text"
                        label={ `[${ index + 1 }] Choice explanation` }
                        onChange={ (e) => setChoiceExplanationValue(index, e.target.value) }
                        onFocus={ () => setChoiceExplanationFocused(index, true) }
                        onBlur={ () => setChoiceExplanationFocused(index, false) }
                        value={ choice.explanation?.value }
                        aria-invalid={ choice.explanation?.error ? 'true' : 'false' }
                        error={ !!choice.explanation?.error && choice.explanation?.displayError }/>
                      { choice.explanation?.error && choice.explanation?.displayError &&
                        <Error text={ choice.explanation.error }/> }
                    </div>
                    <div className="flex flex-col gap-1 -mt-3">
                      <Checkbox
                        label={ <Typography variant="small">[{ index + 1 }] Choice correct</Typography> }
                        name={ `choice-${ index }-correct` }
                        defaultChecked={ choice.correct.value }
                        onChange={ (e) => setChoiceCorrect(index, 'value', e.target.checked) }/>
                    </div>
                    { choices.length > 1 && (
                      <div className="-mt-3">
                        <Button
                          type="button"
                          onClick={ () => removeChoice(index) }>
                          <XMarkIcon className="inline-block h-4 w-4"/> Remove
                        </Button>
                      </div>
                    ) }
                  </div>
                )) }
                <div key="control">
                  <Button
                    type="button"
                    onClick={ () => addChoice() }>
                    <CreateIcon className="inline-block h-4 w-4"/> Add
                  </Button>
                </div>
                { choicesError && <Error text={ choicesError }/> }
              </div>
            ) }

            <div className="flex flex-col gap-2">
              <Select
                name="difficulty"
                label="Difficulty"
                onChange={ (difficulty) => setDifficultyValue(difficulty!) }
                onFocus={ () => setDifficultyFocused(true) }
                containerProps={ {
                  onBlur: (e) => !e.nativeEvent.relatedTarget && setDifficultyFocused(false),
                } }
                value={ difficulty.value }
                aria-invalid={ difficulty.error ? 'true' : 'false' }
                error={ !!difficulty.error && difficulty.displayError }
                className="capitalize">
                { Object.values(QuestionDifficulty).map((difficulty) => (
                  <Option key={ difficulty } value={ difficulty } className="capitalize">{ difficulty }</Option>
                )) }
              </Select>
              { difficulty.error && difficulty.displayError && <Error text={ difficulty.error }/> }
            </div>

            { error && <Error text={ error }/> }

            <div>
              <Button
                type="reset"
                onClick={ handleOpen }>
                Cancel
              </Button>
              <Button
                size="md"
                className="ml-1"
                type="submit"
                disabled={ disabled }>
                { question ? (processing ? 'Updating...' : 'Update') : (processing ? 'Adding...' : 'Add') }
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Dialog>
  </>
}