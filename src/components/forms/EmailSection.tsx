import { Input, Typography } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export type EmailSectionProps = {
  setValue: (email?: string) => void,
}

export default function EmailSection({ setValue }: EmailSectionProps) {

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [ email, setEmail ] = useState('');
  const [ emailValid, setEmailValid ] = useState(true);
  const [ emailFocused, setEmailFocused ] = useState(false);

  useEffect(() => setEmailValid(EMAIL_REGEX.test(email)), [ email ]);
  useEffect(() => setValue(email !== '' && emailValid ? email : undefined), [ email, emailValid ]);

  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h6" color={!emailFocused && email !== '' && !emailValid ? "red" : "blue-gray"}>
        Your Email
      </Typography>
      <Input
        name="email"
        type="email"
        size="lg"
        label="Email Address"
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setEmailFocused(true)}
        onBlur={() => setEmailFocused(false)}
        value={email}
        aria-invalid={email != '' && emailValid ? "false" : "true"}
        error={!emailFocused && email !== '' && !emailValid}
        required
      />
      <Typography
        variant="small"
        color={!emailFocused && email !== '' && !emailValid ? "red" : "gray"}
        className="flex items-center gap-1 font-normal"
      >
        <ExclamationCircleIcon className="w-1/12"/>
        <span className="w-11/12">
          Should be valid email address
        </span>
      </Typography>
    </div>
  );
}