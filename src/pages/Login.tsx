import { Form, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Typography } from "@material-tailwind/react";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import apiClient from "../api/apiClient";
import { useState } from "react";
import EmailSection from "../components/forms/EmailSection.tsx";
import PasswordSection from "../components/forms/PasswordSection.tsx";
import useAuth from "../hooks/useAuth";

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

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginRes = await apiClient.post('/auth', { email, password });
      const token = loginRes?.data?.token;
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      };
      const meRes = await apiClient.get('/me', config);

      setAuth({
        email,
        permissions: meRes?.data?.permissions,
        token,
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
        <ArrowRightEndOnRectangleIcon className="inline-block h-6 w-6"/> Login
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to login
      </Typography>
      <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" onSubmit={handleSubmit}
            method="post">

        <EmailSection setValue={setEmail}/>
        <PasswordSection setValue={setPassword}/>

        <div>
          <Button className="block rounded capitalize" type="submit" disabled={!email || !password}>
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