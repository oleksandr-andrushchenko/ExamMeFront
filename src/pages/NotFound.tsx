import { Link } from "react-router-dom";
import Route from "../enum/Route";
import { Button, Typography } from "@material-tailwind/react";
import { HomeIcon, PuzzlePieceIcon } from "@heroicons/react/24/solid";
import React from "react";

export default () => {
  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <PuzzlePieceIcon className="inline-block h-8 w-8 mr-1"/> Not Found
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Page not found
      </Typography>
      <Link to={Route.HOME}>
        <Button
          size="sm"
          className="rounded capitalize font-normal mt-3">
          <HomeIcon className="inline-block h-4 w-4"/> Go Home
        </Button>
      </Link>
    </>
  )
}
