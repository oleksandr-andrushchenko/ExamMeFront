import { Link, useNavigate } from "react-router-dom";
import { Breadcrumbs, Button, Typography } from "@material-tailwind/react";
import React from "react";
import { ArrowUturnLeftIcon, HomeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Route from "../enum/Route";

export default () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <>
      <Breadcrumbs>
        <Link to={ Route.HOME } className="flex items-center"><HomeIcon
          className="inline-block w-4 h-4 mr-1"/> Home</Link>
      </Breadcrumbs>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">
        <LockClosedIcon className="inline-block h-8 w-8 mr-1"/> Unauthorized
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        You do not have access to the requested page
      </Typography>
      <Button
        size="sm"
        className="rounded capitalize font-normal mt-3"
        onClick={goBack}>
        <ArrowUturnLeftIcon className="inline-block h-4 w-4"/> Go Back
      </Button>
    </>
  )
}
