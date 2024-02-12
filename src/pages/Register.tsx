import { Form } from 'react-router-dom';
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import apiClient from "../api/apiClient";
import { PlusIcon } from "@heroicons/react/24/solid";

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
  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        <PlusIcon className="inline-block h-6 w-6"/> Register
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Nice to meet you! Enter your details to register.
      </Typography>
      <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" method="post">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            name="email"
            size="lg"
            label="Email Address"
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Password
          </Typography>
          <Input
            name="password"
            type="password"
            size="lg"
            label="Password"
          />
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
        <Button className="block rounded capitalize" type="submit">
          Register
        </Button>
        <Typography variant="small" color="gray" className="mt-4 font-normal">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-gray-900">
            Login
          </a>
        </Typography>
      </Form>
    </Card>
  );
}