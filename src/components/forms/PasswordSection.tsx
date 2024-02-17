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
  const [ valid, setValid ] = useState(true);
  const [ focused, setFocused ] = useState(false);
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const [ matches, setMatches ] = useState(true);

  useEffect(() => setValid(PASSWORD_REGEX.test(password)), [ password ]);
  useEffect(() => setMatches(password === confirmPassword), [ password, confirmPassword ]);
  useEffect(() => setValue(password !== '' && valid && (!confirm || matches) ? password : undefined), [ password, valid, matches ]);

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
                    color={!focused && password !== '' && !valid ? "red" : "blue-gray"}>
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={password}
          aria-invalid={password != '' && valid ? "false" : "true"}
          error={!focused && password !== '' && !valid}
          required
        />
        <Typography
          variant="small"
          color={!focused && password !== '' && !valid ? "red" : "gray"}
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
          <Typography variant="h6" color={!focused && !matches ? "red" : "blue-gray"}>
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
            aria-invalid={matches ? "false" : "true"}
            aria-describedby="confirmnote"
            error={!focused && !matches}
            required
          />
          <Typography
            variant="small"
            color={!focused && !matches ? "red" : "gray"}
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