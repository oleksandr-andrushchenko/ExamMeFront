import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import React from "react";
import { ArrowUturnLeftIcon, LockClosedIcon } from "@heroicons/react/24/solid";

export default () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
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
