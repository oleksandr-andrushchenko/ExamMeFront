import { Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

export default () => {
  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <InformationCircleIcon className="inline-block h-8 w-8 mr-1"/>
        <span className="capitalize">Terms and conditions</span>
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Our rules and policies
      </Typography>
    </>
  );
}