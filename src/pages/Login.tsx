import { Form } from 'react-router-dom';
import { Button, Card, Input, Typography } from "@material-tailwind/react";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import apiClient from "../api/apiClient";

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
  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        <ArrowRightEndOnRectangleIcon className="inline-block h-6 w-6"/> Login
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to login
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
        <Button className="block rounded capitalize mt-4" type="submit">
          Login
        </Button>
        <Typography variant="small" color="gray" className="mt-4 font-normal">
          Don't have an account?{" "}
          <a href="/register" className="font-medium text-gray-900">
            Register
          </a>
        </Typography>
      </Form>
    </Card>
  );
}