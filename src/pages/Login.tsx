import { Form, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Typography } from "@material-tailwind/react";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
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
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      setAuth(await postAuth({ email, password }));
      setEmail('');
      setPassword('');
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <ArrowRightEndOnRectangleIcon className="inline-block h-8 w-8 mr-1"/> Login
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Enter your details to login
      </Typography>
      <Form className="mt-6 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" onSubmit={handleSubmit}
            method="post">

        <EmailSection setValue={setEmail} focus/>
        <PasswordSection setValue={setPassword}/>

        <div>
          <Button className="block rounded capitalize" type="submit" disabled={!email || !password || submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant="small" color="gray" className="mt-4 font-normal">
            Don't have an account?{" "}
            <Link to={Route.REGISTER} className="font-medium text-gray-900">
              Register
            </Link>
          </Typography>
        </div>
      </Form>
    </>
  );
}