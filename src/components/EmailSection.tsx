import { Input, Typography } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import InputState, { defaultInputState } from "../types/InputState";

interface EmailSectionProps {
  setValue: (email?: string) => void,
  error: string,
  focus?: boolean,
}

export default function EmailSection({ setValue, error, focus = false }: EmailSectionProps) {

  const [ email, setEmail ] = useState<InputState>({ ...defaultInputState });
  const getEmailError = (value: string | undefined = undefined) => {
    value = value === undefined ? email.value : value;

    if (!value) {
      return 'Should not be empty';
    }

    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Should be valid email address';
    }

    return '';
  }
  const setEmailValue = (value: string) => {
    const error = getEmailError(value);
    setValue(error ? undefined : value);
    setEmail({ ...email, ...{ value, error } });
  }
  const setEmailFocused = (focused: boolean) => {
    const error = focused ? email.error : getEmailError();
    const displayError = error && !focused ? true : email.displayError;
    setEmail({ ...email, ...{ focused, error, displayError } });
  }
  const setEmailError = (error: string) => {
    const displayError = !!error;
    setEmail({ ...email, ...{ error, displayError } });
  }

  useEffect(() => setEmailError(error), [ error ])

  const ref = useRef();
  useEffect(() => {
    setTimeout(() => {
      ref.current.name = 'email';
      ref.current.type = 'email';
      ref.current.value = '';
      ref.current.disabled = false;
      focus && ref.current.focus();
    }, 300);
  }, []);

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
        onChange={ (e) => setEmailValue(e.target.value) }
        onFocus={ () => setEmailFocused(true) }
        onBlur={ () => setEmailFocused(false) }
        value={ email.value }
        aria-invalid={ email.error ? "true" : "false" }
        error={ !!email.error && email.displayError }
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
  );
}