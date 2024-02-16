import { Form, Link } from 'react-router-dom';
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { ArrowRightEndOnRectangleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import apiClient from "../api/apiClient";
import { useEffect, useState } from "react";

export async function loginAction({ request }) {
  const formData = await request.formData();
  const response = await apiClient.post('/auth', {
    email: formData.get('email'),
    password: formData.get('password'),
  });

  console.log(response.data);

  return response.data;
}

export default function Login() {

  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()]).{8,24}$/;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [ email, setEmail ] = useState('');
  const [ emailValid, setEmailValid ] = useState(true);
  const [ emailFocused, setEmailFocused ] = useState(false);
  const [ password, setPassword ] = useState('');
  const [ passwordValid, setPasswordValid ] = useState(true);
  const [ passwordFocused, setPasswordFocused ] = useState(false);

  useEffect(() => setEmailValid(EMAIL_REGEX.test(email)), [ email ]);
  useEffect(() => setPasswordValid(PASSWORD_REGEX.test(password)), [ password ]);

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        <ArrowRightEndOnRectangleIcon className="inline-block h-6 w-6"/> Login
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to login
      </Typography>
      <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" method="post">

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

        <div className="flex flex-col gap-2">
          <Typography variant="h6"
                      color={!passwordFocused && password !== '' && !passwordValid ? "red" : "blue-gray"}>
            Password
          </Typography>
          <Input
            name="password"
            type="password"
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
                Should be from 8 to 24 characters long, uppercase and lowercase letters, a number and a special
                character
              </span>
          </Typography>
        </div>

        <div>
          <Button className="block rounded capitalize" type="submit"
                  disabled={email === '' || !emailValid || password == '' || !passwordValid}>
            Login
          </Button>
          <Typography variant="small" color="gray" className="mt-4 font-normal">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-gray-900">
              Register
            </Link>
          </Typography>
        </div>
      </Form>
    </Card>
  );
}