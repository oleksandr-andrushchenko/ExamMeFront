import { Form, Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Checkbox, Button, Typography } from "@material-tailwind/react";
import apiClient from "../api/apiClient";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import EmailSection from "../components/forms/EmailSection.tsx";
import PasswordSection from "../components/forms/PasswordSection.tsx";
import useAuth from "../hooks/useAuth";

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

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ terms, setTerms ] = useState(false);
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const registerRes = await apiClient.post('/me', { email, password });
      const loginRes = await apiClient.post('/auth', { email, password });

      setAuth({
        email,
        permissions: registerRes?.data?.permissions,
        token: loginRes?.data?.token,
        expires: loginRes?.data?.expires,
      });
      setEmail('');
      setPassword('');
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        <PlusIcon className="inline-block h-6 w-6"/> Register
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to register
      </Typography>
      <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" onSubmit={handleSubmit}
            method="post">

        <EmailSection setValue={setEmail}/>
        <PasswordSection setValue={setPassword} confirm/>

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
          <Button className="block rounded capitalize" type="submit" disabled={!email || !password || !terms}>
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