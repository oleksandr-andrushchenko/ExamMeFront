import { Input, Typography } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { MutableRefObject, useEffect, useRef, useState } from "react";

interface PasswordSectionProps {
  setValue: (password?: string) => void,
  confirm?: boolean,
}

export default function PasswordSection({ setValue, confirm = false }: PasswordSectionProps) {

  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()]).{8,24}$/;

  const [ password, setPassword ] = useState('');
  const [ passwordValid, setPasswordValid ] = useState(true);
  const [ passwordFocused, setPasswordFocused ] = useState(false);
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ passwordsMatches, setPasswordsMatches ] = useState(true);

  useEffect(() => setPasswordValid(PASSWORD_REGEX.test(password)), [ password ]);
  useEffect(() => setPasswordsMatches(password === confirmPassword), [ password, confirmPassword ]);
  useEffect(() => setValue(password !== '' && passwordValid && (!confirm || passwordsMatches) ? password : undefined), [ password, passwordValid, passwordsMatches ]);

  const ref = useRef();
  const confirmRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      ref.current.name = 'password';
      ref.current.type = 'password';
      ref.current.disabled = false;
      ref.current.value = '';
      confirmRef.current.name = 'confirm-password';
      confirmRef.current.type = 'password';
      confirmRef.current.value = '';
      confirmRef.current.disabled = false;
    }, 300);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Typography variant="h6"
                    color={!passwordFocused && password !== '' && !passwordValid ? "red" : "blue-gray"}>
          Password
        </Typography>
        <Input
          inputRef={ref as MutableRefObject<any>}
          name={`temp${Date.now()}`}
          type="number"
          disabled={true}
          size="lg"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          value={password}
          aria-invalid={password != '' && passwordValid ? "false" : "true"}
          error={!passwordFocused && password !== '' && !passwordValid}
          required
        />
        <Typography
          variant="small"
          color={!passwordFocused && password !== '' && !passwordValid ? "red" : "gray"}
          className="flex items-center gap-1 font-normal"
        >
          <ExclamationCircleIcon className="w-1/12"/>
          <span className="w-11/12">
          Should be from 8 to 24 characters long, uppercase and lowercase letters, a number and a special character
        </span>
        </Typography>
      </div>

      {
        confirm &&
        <div className="flex flex-col gap-2">
          <Typography variant="h6" color={!passwordFocused && !passwordsMatches ? "red" : "blue-gray"}>
            Confirm Password
          </Typography>
          <Input
            inputRef={confirmRef as MutableRefObject<any>}
            name={`temp${Date.now()}`}
            type="number"
            disabled={true}
            size="lg"
            label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            aria-invalid={passwordsMatches ? "false" : "true"}
            aria-describedby="confirmnote"
            error={!passwordFocused && !passwordsMatches}
            required
          />
          <Typography
            variant="small"
            color={!passwordFocused && !passwordsMatches ? "red" : "gray"}
            className="flex items-center gap-1 font-normal"
          >
            <ExclamationCircleIcon className="w-1/12"/>
            <span className="w-11/12">
                Should match the password
              </span>
          </Typography>
        </div>
      }
    </>
  );
}