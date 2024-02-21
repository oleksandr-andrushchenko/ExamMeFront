import { Form, Link, useNavigate } from 'react-router-dom';
import { Checkbox, Button, Typography, Breadcrumbs } from "@material-tailwind/react";
import { HomeIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import EmailSection from "../components/EmailSection";
import PasswordSection from "../components/PasswordSection";
import useAuth from "../hooks/useAuth";
import Route from "../enum/Route";
import postMe from "../api/postMe";
import postAuth from "../api/postAuth";

export default () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ terms, setTerms ] = useState(false);
  const [ submitting, setSubmitting ] = useState(false);
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await postMe({ email, password });
      setAuth(await postAuth({ email, password }));
      navigate(Route.HOME, { replace: true });
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
        <Link to={ Route.REGISTER }>Register</Link>
      </Breadcrumbs>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">
        <UserPlusIcon className="inline-block h-8 w-8 mr-1"/> Register
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to register
      </Typography>
      <Form className="mt-6 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" onSubmit={ handleSubmit }
            method="post">

        <EmailSection setValue={ setEmail } focus/>
        <PasswordSection setValue={ setPassword } confirm/>

        <div className="-mt-4">
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal">
                I agree the
                <Link to={ Route.TERMS_AND_CONDITIONS }>Terms and Conditions</Link>
              </Typography>
            }
            onChange={ (e) => setTerms(e.target.checked) }
            required
          />
        </div>

        <div className="-mt-4">
          <Button className="block rounded capitalize" type="submit"
                  disabled={ !email || !password || !terms || submitting }>
            { submitting ? 'Registering in...' : 'Register' }
          </Button>

          <Typography variant="small" color="gray" className="mt-4 font-normal">
            Already have an account?{ " " }
            <Link to={ Route.LOGIN } className="font-medium text-gray-900">
              Login
            </Link>
          </Typography>
        </div>
      </Form>
    </>
  );
}