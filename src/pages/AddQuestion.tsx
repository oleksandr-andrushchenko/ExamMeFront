import { Typography } from "@material-tailwind/react";
import { SquaresPlusIcon } from "@heroicons/react/24/solid";

export default () => {
  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <SquaresPlusIcon className="inline-block h-8 w-8 mr-1"/> Add Question
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Create new question
      </Typography>
    </>
  );
}