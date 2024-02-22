import { Input, ThemeProvider, Typography } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import InputState, { defaultInputState } from "../types/InputState";

interface PasswordSectionProps {
  setValue: (password?: string) => void,
  error: string,
  confirm?: boolean,
}

export default function PasswordSection({ setValue, error, confirm = false }: PasswordSectionProps) {

  const [ password, setPassword ] = useState<InputState>({ ...defaultInputState });
  const getPasswordError = (value: string | undefined = undefined) => {
    value = value === undefined ? password.value : value;

    if (!value) {
      return 'Should not be empty';
    }

    if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()]).{8,24}$/.test(value)) {
      return 'Should be from 8 to 24 characters long, uppercase and lowercase letters, a number and a special character';
    }

    return '';
  }
  const setPasswordValue = (value: string) => {
    const error = getPasswordError(value);
    setValue(error ? undefined : value);
    setPassword({ ...password, ...{ value, error } });
  }
  const setPasswordFocused = (focused: boolean) => {
    const error = focused ? password.error : getPasswordError();
    const displayError = error && !focused ? true : password.displayError;
    setPassword({ ...password, ...{ focused, error, displayError } });
  }
  const setPasswordError = (error: string) => {
    const displayError = !!error;
    setPassword({ ...password, ...{ error, displayError } });
  }
  const [ confirmPassword, setConfirmPassword ] = useState<InputState>({ ...defaultInputState });
  const getConfirmPasswordError = (value: string | undefined = undefined) => {
    value = value === undefined ? confirmPassword.value : value;

    if (confirm && value !== password.value) {
      return 'Should match the password';
    }

    return '';
  }
  const setConfirmPasswordValue = (value: string) => {
    const error = getConfirmPasswordError(value);
    setConfirmPassword({ ...confirmPassword, ...{ value, error } });
  }
  const setConfirmPasswordFocused = (focused: boolean) => {
    const error = focused ? confirmPassword.error : getConfirmPasswordError();
    const displayError = error && !focused ? true : confirmPassword.displayError;
    setConfirmPassword({ ...confirmPassword, ...{ focused, error, displayError } });
  }

  useEffect(() => setPasswordError(error), [ error ])
  useEffect(() => setConfirmPasswordValue(confirmPassword.value), [ password ])

  const ref = useRef();
  const confirmRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      ref.current.name = 'password';
      ref.current.type = 'password';
      ref.current.disabled = false;
      ref.current.value = '';
      if (confirm) {
        confirmRef.current.name = 'confirm-password';
        confirmRef.current.type = 'password';
        confirmRef.current.value = '';
        confirmRef.current.disabled = false;
      }
    }, 300);
  }, []);

  return (
    <>
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
          onChange={ (e) => setPasswordValue(e.target.value) }
          onFocus={ () => setPasswordFocused(true) }
          onBlur={ () => setPasswordFocused(false) }
          value={ password.value }
          aria-invalid={ password.error ? "true" : "false" }
          error={ !!password.error && password.displayError }
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
            onChange={ (e) => setConfirmPasswordValue(e.target.value) }
            onFocus={ () => setConfirmPasswordFocused(true) }
            onBlur={ () => setConfirmPasswordFocused(false) }
            value={ confirmPassword.value }
            aria-invalid={ confirmPassword.error ? "true" : "false" }
            error={ !!confirmPassword.error && confirmPassword.displayError }
            aria-describedby="confirmnote"
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
  );
}