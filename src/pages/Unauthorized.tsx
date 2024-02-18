import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import React from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";

export default function Unauthorized() {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <>
      <h1>Unauthorized</h1>
      <br/>
      <p>You do not have access to the requested page.</p>
      <Button
        size="sm"
        className="rounded capitalize"
        onClick={goBack}>
        <ArrowUturnLeftIcon className="inline-block h-4 w-4"/> Go Back
      </Button>
    </>
  )
}
