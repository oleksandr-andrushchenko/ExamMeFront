import { Form, Link, useNavigate, useLocation } from 'react-router-dom';
import { Breadcrumbs, Button, Typography } from "@material-tailwind/react";
import { ArrowRightEndOnRectangleIcon, HomeIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import EmailSection from "../components/EmailSection";
import PasswordSection from "../components/PasswordSection";
import useAuth from "../hooks/useAuth";
import Route from "../enum/Route";
import postAuth from "../api/postAuth";

export default () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      setAuth(await postAuth({ email, password }));
      navigate((location.pathname === Route.LOGIN ? -1 : 0) as any, { replace: true });
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumbs>
        <Link to={ Route.HOME } className="flex items-center"><HomeIcon
          className="inline-block w-4 h-4 mr-1"/> Home</Link>
        <Link to={ Route.LOGIN }>Login</Link>
      </Breadcrumbs>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">
        <ArrowRightEndOnRectangleIcon className="inline-block h-8 w-8 mr-1"/> Login
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to login
      </Typography>
      <Form className="mt-6 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" onSubmit={ handleSubmit }
            method="post">

        <EmailSection setValue={ setEmail } focus/>
        <PasswordSection setValue={ setPassword }/>

        <div>
          <Button className="block rounded capitalize" type="submit" disabled={ !email || !password || submitting }>
            { submitting ? 'Logging in...' : 'Login' }
          </Button>
          <Typography variant="small" color="gray" className="mt-4 font-normal">
            Don't have an account?{ " " }
            <Link to={ Route.REGISTER } className="font-medium text-gray-900">
              Register
            </Link>
          </Typography>
        </div>
      </Form>
    </>
  );
}