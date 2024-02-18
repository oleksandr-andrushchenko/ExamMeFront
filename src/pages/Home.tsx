import { Typography } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";
import React from "react";

export default () => {
  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <HomeIcon className="inline-block h-8 w-8 mr-1"/> Home
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Latest activities
      </Typography>
    </>
  );
}