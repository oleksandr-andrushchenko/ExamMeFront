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

  const [ password, setPassword ] = useState('');
  const [ passwordFocused, setPasswordFocused ] = useState(false);

  const [ confirmPassword, setConfirmPassword ] = useState('');

  const [ passwordsMatches, setPasswordsMatches ] = useState(false);

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
          </div>

          <div className="flex flex-col gap-2">
            <Typography variant="h6" color="blue-gray">
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
            />
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
              <ExclamationCircleIcon className="inline-block h-6 w-6"/>
              Must match the first password input field
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
            <Button className="block rounded capitalize" type="submit" disabled={!passwordsMatches}>
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