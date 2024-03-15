import {
  Button,
  Card,
  CardBody,
  Checkbox,
  Dialog,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from '@material-tailwind/react'
import { ExclamationCircleIcon, PencilIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import { Params, useNavigate, useParams } from 'react-router-dom'
import InputState, { defaultInputState } from '../../types/InputState'
import Category from '../../schema/Category'
import QuestionTransfer, {
  QuestionAnswer,
  QuestionChoice,
  QuestionDifficulty,
  QuestionType,
} from '../../schema/QuestionTransfer'
import postQuestion from '../../api/question/postQuestion'
import normalizeApiErrors from '../../utils/normalizeApiErrors'
import getCategory from '../../api/category/getCategory'
import Route from '../../enum/Route'
import Question from '../../schema/Question'
import replaceQuestion from '../../api/question/replaceQuestion'
import getQuestion from '../../api/question/getQuestion'

interface Props {
  question?: Question,
  onSubmit?: (question: Question) => void
}

type AnswerInputState = {
  [key in keyof QuestionAnswer]: InputState
}

type ChoiceInputState = {
  [key in keyof QuestionChoice]: InputState
}

export default ({ question, onSubmit }: Props): ReactNode => {
  const [ open, setOpen ] = useState<boolean>(false)
  const [ processing, setProcessing ] = useState<boolean>(false)
  const handleOpen = () => setOpen(!open)
  const [ error, setError ] = useState<string>('')
  const navigate = useNavigate()

  const { categoryId }: Params = useParams<Params>()
  const [ category, setCategory ] = useState<Category>()

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
  const setTitleValue = (value: string): void => {
    const error = getTitleError(value)
    setTitle({ ...title, ...{ value, error } })
  }
  const setTitleFocused = (focused: boolean): void => {
    const error = focused ? title.error : getTitleError()
    const displayError = error && !focused ? true : title.displayError
    setTitle({ ...title, ...{ focused, error, displayError } })
  }
  const setTitleError = (error: string): void => {
    const displayError = !!error
    setTitle({ ...title, ...{ error, displayError } })
  }

  const [ type, setType ] = useState<InputState>({ ...defaultInputState, ...{ value: question?.type } })
  const getTypeError = (value: string | undefined = undefined): string => {
    value = value === undefined ? type.value : value

    if (!value) {
      return 'Should not be empty'
    }

    return ''
  }
  const setTypeValue = (value: string): void => {
    const error = getTypeError(value)
    setType({ ...type, ...{ value, error } })
  }
  const setTypeFocused = (focused: boolean): void => {
    const error = focused ? type.error : getTypeError()
    const displayError = error && !focused ? true : type.displayError
    setType({ ...type, ...{ focused, error, displayError } })
  }
  const setTypeError = (error: string): void => {
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
  const setAnswer = (index: number, prop: string, key: string, value: any): void => {
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

    if (value && !/.*[a-zA-Z]{2,}/.test(value)) {
      return 'Should be from 2 characters long, lowercase and digits allowed'
    }

    return ''
  }
  const setAnswerVariantsValue = (index: number, value: string): void => {
    const tmp = answers.slice()
    const old: InputState = tmp[index]['variants']
    const error = getAnswerVariantsError(index, value)
    tmp[index]['variants'] = { ...old, ...{ value, error } }
    setAnswers(tmp)
  }
  const setAnswerVariantsFocused = (index: number, focused: boolean): void => {
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
  const setAnswerExplanationValue = (index: number, value: any): void => {
    const tmp = answers.slice()
    const old: InputState = tmp[index]['explanation']!
    const error = getAnswerExplanationError(index, value)
    tmp[index]['explanation'] = { ...old, ...{ value, error } }
    setAnswers(tmp)
  }
  const setAnswerExplanationFocused = (index: number, focused: boolean): void => {
    const tmp = answers.slice()
    const old: InputState = tmp[index]['explanation']!
    const error = focused ? old.error : getAnswerExplanationError(index)
    const displayError = error && !focused ? true : old.displayError
    tmp[index]['explanation'] = { ...old, ...{ focused, error, displayError } }
    setAnswers(tmp)
  }
  const setAnswerCorrect = (index: number, key: string, value: any) => setAnswer(index, 'correct', key, value)
  const addAnswer = (): void => {
    const tmp = answers.slice()
    tmp.push({ ...defaultAnswerInputState })
    setAnswers(tmp)
  }
  const removeAnswer = (index: number): void => {
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
  const setChoice = (index: number, prop: string, key: string, value: any): void => {
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
  const setChoiceTitleValue = (index: number, value: string): void => {
    const tmp = choices.slice()
    const old: InputState = tmp[index]['title']
    const error = getChoiceTitleError(index, value)
    tmp[index]['title'] = { ...old, ...{ value, error } }
    setChoices(tmp)
  }
  const setChoiceTitleFocused = (index: number, focused: boolean): void => {
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
  const setChoiceExplanationValue = (index: number, value: any): void => {
    const tmp = choices.slice()
    const old: InputState = tmp[index]['explanation']!
    const error = getChoiceExplanationError(index, value)
    tmp[index]['explanation'] = { ...old, ...{ value, error } }
    setChoices(tmp)
  }
  const setChoiceExplanationFocused = (index: number, focused: boolean): void => {
    const tmp = choices.slice()
    const old: InputState = tmp[index]['explanation']!
    const error = focused ? old.error : getChoiceExplanationError(index)
    const displayError = error && !focused ? true : old.displayError
    tmp[index]['explanation'] = { ...old, ...{ focused, error, displayError } }
    setChoices(tmp)
  }
  const setChoiceCorrect = (index: number, key: string, value: any) => setChoice(index, 'correct', key, value)
  const addChoice = (): void => {
    const tmp = choices.slice()
    tmp.push({ ...defaultChoiceInputState })
    setChoices(tmp)
  }
  const removeChoice = (index: number): void => {
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
  const setDifficultyValue = (value: string): void => {
    const error = getDifficultyError(value)
    setDifficulty({ ...difficulty, ...{ value, error } })
  }
  const setDifficultyFocused = (focused: boolean): void => {
    const error = focused ? difficulty.error : getDifficultyError()
    const displayError = error && !focused ? true : difficulty.displayError
    setDifficulty({ ...difficulty, ...{ focused, error, displayError } })
  }
  const setDifficultyError = (error: string): void => {
    const displayError = !!error
    setDifficulty({ ...difficulty, ...{ error, displayError } })
  }

  const [ disabled, setDisabled ] = useState<boolean>(true)

  const isDisabled = (): boolean => {
    const invalid = !title.value || title.error || !type.value || type.error || !difficulty.value || difficulty.error || processing

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    try {
      if (!validate()) {
        return
      }

      setProcessing(true)

      const transfer: QuestionTransfer = {
        category: categoryId as string,
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

      const questionResp = question ? (await replaceQuestion(question.id, transfer)) : (await postQuestion(transfer))
      setOpen(false)
      const catId = question ? question.category : questionResp.category
      const questionId = question ? question.id : questionResp.id
      navigate(Route.QUESTION.replace(':categoryId', catId).replace(':questionId', questionId))

      if (onSubmit) {
        getQuestion(questionId).then((question: Question): void => onSubmit(question))
      }
    } catch (err) {
      const errors = normalizeApiErrors(err)
      console.log(errors)
      setTitleError(errors?.title || '')
      setTypeError(errors?.type || '')
      setAnswersError(errors?.answers || '')
      setChoicesError(errors?.choices || '')
      setDifficultyError(errors?.difficulty || '')
      setError(errors?.unknown || '')
    } finally {
      setProcessing(false)
    }
  }

  useEffect((): void => {
    getCategory(categoryId as string).then((category) => setCategory(category))
  }, [])
  useEffect(() => setDisabled(isDisabled()), [ title, type, choices, answers, difficulty ])

  return <>
    <Button
      size="sm"
      color={ question ? 'orange' : 'green' }
      onClick={ handleOpen }
      disabled={ processing }>
      { question ? <PencilIcon className="inline-block h-4 w-4"/> : <PlusIcon
        className="inline-block h-4 w-4"/> } { question ? (processing ? 'Updating Question...' : 'Update Question') : (processing ? 'Adding Question...' : 'Add Question') }
    </Button>
    <Dialog size="xs" open={ open } handler={ handleOpen } className="bg-transparent shadow-none">
      <Card>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            { question ? 'Update question' : 'Add question' }
          </Typography>
          <form className="flex flex-col gap-6" onSubmit={ handleSubmit }
                method="post">

            <div className="flex flex-col gap-2">
              <Typography
                variant="h6"
                color={ title.error && title.displayError ? 'red' : 'blue-gray' }>
                Title
              </Typography>
              <Textarea
                name="title"
                type="text"
                size="md"
                label="Question title"
                onChange={ (e) => setTitleValue(e.target.value) }
                onFocus={ () => setTitleFocused(true) }
                onBlur={ () => setTitleFocused(false) }
                value={ title.value }
                aria-invalid={ title.error ? 'true' : 'false' }
                error={ !!title.error && title.displayError }
                required/>
              { title.error && title.displayError && <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal">
                <ExclamationCircleIcon className="w-1/12"/>
                <span className="w-11/12">{ title.error }</span>
              </Typography> }
            </div>

            <div className="flex flex-col gap-2">
              <Typography
                variant="h6"
                color={ type.error && type.displayError ? 'red' : 'blue-gray' }>
                Type
              </Typography>
              <Select
                name="type"
                size="md"
                label="Question type"
                onChange={ (type) => setTypeValue(type!) }
                onFocus={ () => setTypeFocused(true) }
                containerProps={ {
                  onBlur: (e) => !e.nativeEvent.relatedTarget && setTypeFocused(false),
                } }
                value={ type.value }
                className="capitalize"
                aria-invalid={ type.error ? 'true' : 'false' }
                error={ !!type.error && type.displayError }>
                { Object.values(QuestionType)
                  .map(type => <Option key={ type } value={ type } className="capitalize">{ type }</Option>) }
              </Select>
              { type.error && type.displayError && <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal">
                <ExclamationCircleIcon className="w-1/12"/>
                <span className="w-11/12">{ type.error }</span>
              </Typography> }
            </div>

            { type.value === QuestionType.TYPE && <div className="flex flex-col gap-2">
              <Typography variant="h6" color="blue-gray">Answers</Typography>
              <div className="border border-solid rounded border-blue-gray-100 p-3 flex flex-col gap-3">
                { answers.map((answer: AnswerInputState, index: number) => (
                  <div key={ `answer-${ index }` } className="flex flex-col gap-3">
                    <span className="flex flex-col gap-1">Question answer #{ index + 1 }</span>
                    <div className="flex flex-col gap-1">
                      <Typography
                        variant="small"
                        color={ answer.variants.error && answer.variants.displayError ? 'red' : 'blue-gray' }>
                        Variants
                      </Typography>
                      <Input
                        name={ `answer-${ index }-variants` }
                        type="text"
                        size="md"
                        label={ `Question answer #${ index + 1 } variants (separated by comma)` }
                        onChange={ (e) => setAnswerVariantsValue(index, e.target.value) }
                        onFocus={ () => setAnswerVariantsFocused(index, true) }
                        onBlur={ () => setAnswerVariantsFocused(index, false) }
                        value={ answer.variants.value }
                        aria-invalid={ answer.variants.error ? 'true' : 'false' }
                        error={ !!answer.variants.error && answer.variants.displayError }
                        required/>
                      { answer.variants.error && answer.variants.displayError && <Typography
                        variant="small"
                        color="red"
                        className="flex items-center gap-1 font-normal">
                        <ExclamationCircleIcon className="w-1/12"/>
                        <span className="w-11/12">{ answer.variants.error }</span>
                      </Typography> }
                    </div>
                    <div className="flex flex-col gap-1">
                      <Typography
                        variant="small"
                        color={ answer.explanation?.error && answer.explanation.displayError ? 'red' : 'blue-gray' }>
                        Explanation
                      </Typography>
                      <Textarea
                        name={ `answer-${ index }-explanation` }
                        type="text"
                        size="md"
                        label={ `Question answer #${ index + 1 } explanation` }
                        onChange={ (e) => setAnswerExplanationValue(index, e.target.value) }
                        onFocus={ () => setAnswerExplanationFocused(index, true) }
                        onBlur={ () => setAnswerExplanationFocused(index, false) }
                        value={ answer.explanation?.value }
                        aria-invalid={ answer.explanation?.error ? 'true' : 'false' }
                        error={ !!answer.explanation?.error && answer.explanation?.displayError }/>
                      { answer.explanation?.error && answer.explanation.displayError && <Typography
                        variant="small"
                        color="red"
                        className="flex items-center gap-1 font-normal">
                        <ExclamationCircleIcon className="w-1/12"/>
                        <span className="w-11/12">{ answer.explanation.error }</span>
                      </Typography> }
                    </div>
                    <div className="flex flex-col gap-1 -mt-3">
                      <Checkbox
                        label={
                          <div>
                            <Typography variant="small" color="gray" className="font-normal">
                              Correct
                            </Typography>
                            <Typography variant="small" color="gray" className="font-normal text-xs">
                              Question answer #{ index + 1 } correct
                            </Typography>
                          </div>
                        }
                        name={ `answer-${ index }-correct` }
                        defaultChecked={ answer.correct.value }
                        onChange={ (e) => setAnswerCorrect(index, 'value', e.target.checked) }/>
                    </div>
                    { answers.length > 1 && <div className="-mt-3">
                      <Button
                        size="sm"
                        type="button"
                        onClick={ () => removeAnswer(index) }
                        className="rounded capitalize font-normal">
                        <XMarkIcon className="inline-block h-4 w-4"/> Remove
                      </Button>
                    </div> }
                  </div>
                )) }
                <div key="control">
                  <Button
                    size="sm"
                    type="button"
                    onClick={ () => addAnswer() }
                    className="rounded capitalize font-normal">
                    <PlusIcon className="inline-block h-4 w-4"/> Add
                  </Button>
                </div>
                { answersError && <Typography
                  variant="small"
                  color="red"
                  className="flex items-center gap-1 font-normal">
                  <ExclamationCircleIcon className="w-1/12"/>
                  <span className="w-11/12">{ answersError }</span>
                </Typography> }
              </div>
            </div> }

            { type.value === QuestionType.CHOICE && <div className="flex flex-col gap-2">
              <Typography variant="h6" color="blue-gray">Choices</Typography>
              <div className="border border-solid rounded border-blue-gray-100 p-3 flex flex-col gap-3">
                { choices.map((choice: ChoiceInputState, index: number) => (
                  <div key={ `choice-${ index }` } className="flex flex-col gap-3">
                    <span className="flex flex-col gap-1">Question choice #{ index + 1 }</span>
                    <div className="flex flex-col gap-1">
                      <Typography
                        variant="small"
                        color={ choice.title.error && choice.title.displayError ? 'red' : 'blue-gray' }>
                        Title
                      </Typography>
                      <Textarea
                        name={ `choice-${ index }-title` }
                        type="text"
                        size="md"
                        label={ `Question choice #${ index + 1 } title` }
                        onChange={ (e) => setChoiceTitleValue(index, e.target.value) }
                        onFocus={ () => setChoiceTitleFocused(index, true) }
                        onBlur={ () => setChoiceTitleFocused(index, false) }
                        value={ choice.title.value }
                        aria-invalid={ choice.title.error ? 'true' : 'false' }
                        error={ !!choice.title.error && choice.title.displayError }
                        required/>
                      { choice.title.error && choice.title.displayError && <Typography
                        variant="small"
                        color="red"
                        className="flex items-center gap-1 font-normal">
                        <ExclamationCircleIcon className="w-1/12"/>
                        <span className="w-11/12">{ choice.title.error }</span>
                      </Typography> }
                    </div>
                    <div className="flex flex-col gap-1">
                      <Typography
                        variant="small"
                        color={ choice.explanation?.error && choice.explanation.displayError ? 'red' : 'blue-gray' }>
                        Explanation
                      </Typography>
                      <Textarea
                        name={ `choice-${ index }-explanation` }
                        type="text"
                        size="md"
                        label={ `Question choice #${ index + 1 } explanation` }
                        onChange={ (e) => setChoiceExplanationValue(index, e.target.value) }
                        onFocus={ () => setChoiceExplanationFocused(index, true) }
                        onBlur={ () => setChoiceExplanationFocused(index, false) }
                        value={ choice.explanation?.value }
                        aria-invalid={ choice.explanation?.error ? 'true' : 'false' }
                        error={ !!choice.explanation?.error && choice.explanation?.displayError }/>
                      { choice.explanation?.error && choice.explanation?.displayError && <Typography
                        variant="small"
                        color="red"
                        className="flex items-center gap-1 font-normal">
                        <ExclamationCircleIcon className="w-1/12"/>
                        <span className="w-11/12">{ choice.explanation.error }</span>
                      </Typography> }
                    </div>
                    <div className="flex flex-col gap-1 -mt-3">
                      <Checkbox
                        label={
                          <div>
                            <Typography variant="small" color="gray" className="font-normal">Correct</Typography>
                            <Typography variant="small" color="gray" className="font-normal text-xs">
                              Question choice #{ index + 1 } correct
                            </Typography>
                          </div>
                        }
                        name={ `choice-${ index }-correct` }
                        defaultChecked={ choice.correct.value }
                        onChange={ (e) => setChoiceCorrect(index, 'value', e.target.checked) }/>
                    </div>
                    { choices.length > 1 && <div className="-mt-3">
                      <Button
                        size="sm"
                        type="button"
                        onClick={ () => removeChoice(index) }
                        className="rounded capitalize font-normal">
                        <XMarkIcon className="inline-block h-4 w-4"/> Remove
                      </Button>
                    </div> }
                  </div>
                )) }
                <div key="control">
                  <Button
                    size="sm"
                    type="button"
                    onClick={ () => addChoice() }
                    className="rounded capitalize font-normal">
                    <PlusIcon className="inline-block h-4 w-4"/> Add
                  </Button>
                </div>
                { choicesError && <Typography
                  variant="small"
                  color="red"
                  className="flex items-center gap-1 font-normal">
                  <ExclamationCircleIcon className="w-1/12"/>
                  <span className="w-11/12">{ choicesError }</span>
                </Typography> }
              </div>
            </div> }

            <div className="flex flex-col gap-2">
              <Typography
                variant="h6"
                color={ difficulty.error && difficulty.displayError ? 'red' : 'blue-gray' }>
                Difficulty
              </Typography>
              <Select
                name="difficulty"
                size="md"
                label="Question difficulty"
                onChange={ (difficulty) => setDifficultyValue(difficulty!) }
                onFocus={ () => setDifficultyFocused(true) }
                containerProps={ {
                  onBlur: (e) => !e.nativeEvent.relatedTarget && setDifficultyFocused(false),
                } }
                value={ difficulty.value }
                className="capitalize"
                aria-invalid={ difficulty.error ? 'true' : 'false' }
                error={ !!difficulty.error && difficulty.displayError }>
                { Object.values(QuestionDifficulty)
                  .map(difficulty => <Option key={ difficulty } value={ difficulty }
                                             className="capitalize">{ difficulty }</Option>) }
              </Select>
              { difficulty.error && difficulty.displayError && <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal">
                <ExclamationCircleIcon className="w-1/12"/>
                <span className="w-11/12">{ difficulty.error }</span>
              </Typography> }
            </div>

            { error && <Typography
              variant="small"
              color="red"
              className="flex items-center gap-1 font-normal">
              <ExclamationCircleIcon className="w-1/12"/>
              <span className="w-11/12">{ error }</span>
            </Typography> }

            <div>
              <Button
                size="sm"
                type="reset"
                onClick={ handleOpen }>
                Cancel
              </Button>
              <Button
                size="md"
                color={ question ? 'orange' : 'green' }
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