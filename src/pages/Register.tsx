import { Form, Link } from 'react-router-dom';
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import apiClient from "../api/apiClient";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import EmailSection from "../components/forms/EmailSection.tsx";
import PasswordSection from "../components/forms/PasswordSection.tsx";

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

  const [ emailReady, setEmailReady ] = useState(true);
  const [ passwordReady, setPasswordReady ] = useState(true);
  const [ terms, setTerms ] = useState(false);

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        <PlusIcon className="inline-block h-6 w-6"/> Register
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to register
      </Typography>
      <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" method="post">

        <EmailSection setReadyState={setEmailReady}/>
        <PasswordSection setReadyState={setPasswordReady} confirm/>

        <Checkbox
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center font-normal"
            >
              I agree the
              <Link to="/terms-and-conditions">Terms and Conditions</Link>
            </Typography>
          }
          onChange={(e) => setTerms(e.target.checked)}
          required
        />

        <div>
          <Button className="block rounded capitalize" type="submit" disabled={!emailReady || !passwordReady || !terms}>
            Register
          </Button>

          <Typography variant="small" color="gray" className="mt-4 font-normal">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-gray-900">
              Login
            </Link>
          </Typography>
        </div>
      </Form>
    </Card>
  );
}