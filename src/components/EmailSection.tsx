import { Input, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import React, { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import InputState, { defaultInputState } from '../types/InputState'
import testsRunning from '../utils/testsRunning'

interface EmailSectionProps {
  setValue: (email?: string) => void,
  error: string,
  focus?: boolean,
}

export default ({ setValue, error, focus = false }: EmailSectionProps): ReactNode => {

  const [ email, setEmail ] = useState<InputState>({ ...defaultInputState })
  const getEmailError = (value: string | undefined = undefined): string => {
    value = value === undefined ? email.value : value

    if (!value) {
      return 'Should not be empty'
    }

    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Should be valid email address'
    }

    return ''
  }
  const setEmailValue = (value: string): void => {
    const error = getEmailError(value)
    setValue(error ? undefined : value)
    setEmail({ ...email, ...{ value, error } })
  }
  const setEmailFocused = (focused: boolean): void => {
    const error = focused ? email.error : getEmailError()
    const displayError = error && !focused ? true : email.displayError
    setEmail({ ...email, ...{ focused, error, displayError } })
  }
  const setEmailError = (error: string): void => {
    const displayError = !!error
    setEmail({ ...email, ...{ error, displayError } })
  }

  useEffect((): void => setEmailError(error), [ error ])

  const ref = useRef<HTMLInputElement>()
  useEffect((): void => {
    const restore = (): void => {
      ref.current.name = 'email'
      ref.current.type = 'email'
      ref.current.value = ''
      ref.current.disabled = false
      focus && ref.current.focus()
    }
    testsRunning() ? restore() : setTimeout(restore, 300)
  }, [])

  return (
    <div className="flex flex-col gap-2">
      <Typography
        variant="h6"
        color={ email.error && email.displayError ? "red" : "blue-gray" }>
        Your Email
      </Typography>
      <Input
        inputRef={ ref as MutableRefObject<any> }
        name={ `temp${ Date.now() }` }
        type="number"
        disabled={ true }
        size="lg"
        label="Email Address"
        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => setEmailValue(e.target.value) }
        onFocus={ (): void => setEmailFocused(true) }
        onBlur={ (): void => setEmailFocused(false) }
        value={ email.value }
        aria-invalid={ email.error ? "true" : "false" }
        error={ !!email.error && email.displayError }
        placeholder="Email Address"
        required
      />
      { email.error && email.displayError && <Typography
        variant="small"
        color="red"
        className="flex items-center gap-1 font-normal">
        <ExclamationCircleIcon className="w-1/12"/>
        <span className="w-11/12">{ email.error }</span>
      </Typography> }
    </div>
  )
}