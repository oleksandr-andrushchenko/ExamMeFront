import { Input, Typography } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import classNames from "../utils/classNames";

interface EmailSectionProps {
  setValue: (email?: string) => void,
  focus?: boolean,
}

export default function EmailSection({ setValue, focus = false }: EmailSectionProps) {

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [ email, setEmail ] = useState('');
  const [ valid, setValid ] = useState(true);
  const [ focused, setFocused ] = useState(false);
  const [ displayError, setDisplayError ] = useState(false);
  const [ error, setError ] = useState(false);

  useEffect(() => setValid(EMAIL_REGEX.test(email)), [ email ]);
  useEffect(() => {
    setValue(email !== '' && valid ? email : undefined);
    setError(email !== '' && !valid);
  }, [ email, valid ]);
  ``
  useEffect(() => {
    if (error && !focused) {
      setDisplayError(true);
    }
  }, [ focused ]);

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
        color={error && displayError ? "red" : "blue-gray"}>
        Your Email
      </Typography>
      <Input
        inputRef={ref as MutableRefObject<any>}
        name={`temp${Date.now()}`}
        type="number"
        disabled={true}
        size="lg"
        label="Email Address"
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        value={email}
        aria-invalid={error ? "true" : "false"}
        error={error && displayError}
        required
      />
      <Typography
        variant="small"
        color="red"
        className={classNames(
          'flex items-center gap-1 font-normal',
          error && displayError ? '' : 'hidden'
        )}>
        <ExclamationCircleIcon className="w-1/12"/>
        <span className="w-11/12">
          Should be valid email address
        </span>
      </Typography>
    </div>
  );
}