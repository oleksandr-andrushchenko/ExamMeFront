import { Input, Typography } from '@material-tailwind/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import React, { MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react'
import InputState, { defaultInputState } from '../types/InputState'
import testsRunning from '../utils/testsRunning'

interface PasswordSectionProps {
  setValue: (password?: string) => void,
  error: string,
  confirm?: boolean,
}

export default ({ setValue, error, confirm = false }: PasswordSectionProps): ReactNode => {

  const [ password, setPassword ] = useState<InputState>({ ...defaultInputState })
  const getPasswordError = (value: string | undefined = undefined): string => {
    value = value === undefined ? password.value : value

    if (!value) {
      return 'Should not be empty'
    }

    if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()]).{8,24}$/.test(value)) {
      return 'Should be from 8 to 24 characters long, uppercase and lowercase letters, a number and a special character'
    }

    return ''
  }
  const setPasswordValue = (value: string): void => {
    const error = getPasswordError(value)
    setValue(error ? undefined : value)
    setPassword({ ...password, ...{ value, error } })
  }
  const setPasswordFocused = (focused: boolean): void => {
    const error = focused ? password.error : getPasswordError()
    const displayError = error && !focused ? true : password.displayError
    setPassword({ ...password, ...{ focused, error, displayError } })
  }
  const setPasswordError = (error: string): void => {
    const displayError = !!error
    setPassword({ ...password, ...{ error, displayError } })
  }
  const [ confirmPassword, setConfirmPassword ] = useState<InputState>({ ...defaultInputState })
  const getConfirmPasswordError = (value: string | undefined = undefined): string => {
    value = value === undefined ? confirmPassword.value : value

    if (confirm && value !== password.value) {
      return 'Should match the password'
    }

    return ''
  }
  const setConfirmPasswordValue = (value: string): void => {
    const error = getConfirmPasswordError(value)
    setConfirmPassword({ ...confirmPassword, ...{ value, error } })
  }
  const setConfirmPasswordFocused = (focused: boolean): void => {
    const error = focused ? confirmPassword.error : getConfirmPasswordError()
    const displayError = error && !focused ? true : confirmPassword.displayError
    setConfirmPassword({ ...confirmPassword, ...{ focused, error, displayError } })
  }

  useEffect((): void => setPasswordError(error), [ error ])
  useEffect((): void => setConfirmPasswordValue(confirmPassword.value), [ password ])

  const ref = useRef<HTMLInputElement>()
  const confirmRef = useRef<HTMLInputElement>()
  useEffect((): void => {
    const restore = (): void => {
      ref.current!.name = 'password'
      ref.current!.type = 'password'
      ref.current!.disabled = false
      ref.current!.value = ''
      if (confirm) {
        confirmRef.current!.name = 'confirm-password'
        confirmRef.current!.type = 'password'
        confirmRef.current!.value = ''
        confirmRef.current!.disabled = false
      }
    }
    testsRunning() ? restore() : setTimeout(restore, 300)
  }, [])

  return <>
    <div className="flex flex-col gap-2">
      <Typography
        variant="h6"
        color={ password.error && password.displayError ? "red" : "blue-gray" }>
        Password
      </Typography>
      <Input
        inputRef={ ref as MutableRefObject<any> }
        name={ `temp${ Date.now() }` }
        type="number"
        disabled={ true }
        size="lg"
        label="Password"
        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => setPasswordValue(e.target.value) }
        onFocus={ (): void => setPasswordFocused(true) }
        onBlur={ (): void => setPasswordFocused(false) }
        value={ password.value }
        aria-invalid={ password.error ? "true" : "false" }
        error={ !!password.error && password.displayError }
        placeholder="Password"
        required
      />
      { password.error && password.displayError && <Typography
        variant="small"
        color="red"
        className="flex items-center gap-1 font-normal">
        <ExclamationCircleIcon className="w-1/12"/>
        <span className="w-11/12">{ password.error }</span>
      </Typography> }
    </div>

    {
      confirm &&
      <div className="flex flex-col gap-2">
        <Typography
          variant="h6"
          color={ confirmPassword.error && confirmPassword.displayError ? "red" : "blue-gray" }>
          Confirm Password
        </Typography>
        <Input
          inputRef={ confirmRef as MutableRefObject<any> }
          name={ `temp${ Date.now() }` }
          type="number"
          disabled={ true }
          size="lg"
          label="Confirm Password"
          onChange={ (e: React.ChangeEvent<HTMLInputElement>): void => setConfirmPasswordValue(e.target.value) }
          onFocus={ (): void => setConfirmPasswordFocused(true) }
          onBlur={ (): void => setConfirmPasswordFocused(false) }
          value={ confirmPassword.value }
          aria-invalid={ confirmPassword.error ? "true" : "false" }
          error={ !!confirmPassword.error && confirmPassword.displayError }
          aria-describedby="confirmnote"
          placeholder="Confirm Password"
          required
        />
        { confirmPassword.error && confirmPassword.displayError && <Typography
          variant="small"
          color="red"
          className="flex items-center gap-1 font-normal">
          <ExclamationCircleIcon className="w-1/12"/>
          <span className="w-11/12">{ confirmPassword.error }</span>
        </Typography> }
      </div>
    }
  </>
}