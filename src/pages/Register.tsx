import { Form, Link } from 'react-router-dom';
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import apiClient from "../api/apiClient";
import { PlusIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export async function registerAction({ request }) {
  const formData = await request.formData();
  const response = await apiClient.post('/me', {
    email: formData.get('email'),
    password: formData.get('password'),
  });

  console.log(response.data);

  return response.data;
}

export default function Register() {

  const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%~]).{8,24}$/;

  const [ password, setPassword ] = useState('');
  const [ validPassword, setValidPassword ] = useState(true);
  const [ passwordFocused, setPasswordFocused ] = useState(false);

  const [ confirmPassword, setConfirmPassword ] = useState('');

  const [ passwordsMatches, setPasswordsMatches ] = useState(true);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
  }, [ password ]);

  useEffect(() => {
    setPasswordsMatches(password === confirmPassword);
  }, [ password, confirmPassword ]);

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        <PlusIcon className="inline-block h-6 w-6"/> Register
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to register
      </Typography>
      <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" method="post">
        <div className="flex flex-col gap-6">

          <div className="flex flex-col gap-2">
            <Typography variant="h6" color="blue-gray">
              Your Email
            </Typography>
            <Input
              name="email"
              size="lg"
              label="Email Address"
            />
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal"
            >
              <ExclamationCircleIcon className="w-1/12"/>
              <div className="w-11/12">
                Should be valid email address
              </div>
            </Typography>
          </div>

          <div className="flex flex-col gap-2">
            <Typography variant="h6" color={!passwordFocused && password !== '' && !validPassword ? "red" : "blue-gray"}>
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
              aria-invalid={password != '' && validPassword ? "false" : "true"}
              error={!passwordFocused && password !== '' && !validPassword}
            />
            <Typography
              variant="small"
              color={!passwordFocused && password !== '' && !validPassword ? "red" : "gray"}
              className="flex items-center gap-1 font-normal"
            >
              <ExclamationCircleIcon className="w-1/12"/>
              <div className="w-11/12">
                8 to 24 characters, uppercase and lowercase letters, a number and a special character
              </div>
            </Typography>
          </div>

          <div className="flex flex-col gap-2">
            <Typography variant="h6" color={!passwordFocused && !passwordsMatches ? "red" : "blue-gray"}>
              Confirm Password
            </Typography>
            <Input
              name="confirm-password"
              type="password"
              size="lg"
              label="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              aria-invalid={passwordsMatches ? "false" : "true"}
              aria-describedby="confirmnote"
              error={!passwordFocused && !passwordsMatches}
            />
            <Typography
              variant="small"
              color={!passwordFocused && !passwordsMatches ? "red" : "gray"}
              className="flex items-center gap-1 font-normal"
            >
              <ExclamationCircleIcon className="w-1/12"/>
              <div className="w-11/12">
                Must match the first password input field
              </div>
            </Typography>
          </div>

          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                I agree the
                <a
                  href="#"
                  className="font-medium transition-colors hover:text-gray-900"
                >
                  &nbsp;Terms and Conditions
                </a>
              </Typography>
            }
            required
          />

          <div>
            <Button className="block rounded capitalize" type="submit" disabled={!validPassword || !passwordsMatches}>
              Register
            </Button>

            <Typography variant="small" color="gray" className="mt-4 font-normal">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-gray-900">
                Login
              </Link>
            </Typography>
          </div>
        </div>
      </Form>
    </Card>
  );
}