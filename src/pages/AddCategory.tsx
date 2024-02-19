import { Button, Input, Typography } from "@material-tailwind/react";
import { ExclamationCircleIcon, SquaresPlusIcon } from "@heroicons/react/24/solid";
import { Form, useNavigate } from "react-router-dom";
import Route from "../enum/Route";
import { useEffect, useState } from "react";
import classNames from "../utils/classNames";
import postCategory from "../api/postCategory";

export default () => {
  const navigate = useNavigate();

  const NAME_REGEX = /^[a-zA-Z0-9 ]{2,24}$/;

  const [ name, setName ] = useState('');
  const [ nameValid, setNameValid ] = useState(true);
  const [ nameFocused, setNameFocused ] = useState(false);
  const [ nameError, setNameError ] = useState(false);
  const [ displayNameError, setDisplayNameError ] = useState(false);
  const [ submitting, setSubmitting ] = useState(false);

  useEffect(() => setNameValid(NAME_REGEX.test(name)), [ name ])
  useEffect(() => setNameError(name !== '' && !nameValid), [ name, nameValid ])
  useEffect(() => {
    if (nameError && !nameFocused) {
      setDisplayNameError(true);
    }
  }, [ nameFocused ])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const category = await postCategory({ name });
      navigate(Route.CATEGORY.replace(':categoryId', category.id));
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <SquaresPlusIcon className="inline-block h-8 w-8 mr-1"/> Add Category
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Create new category
      </Typography>
      <Form className="mt-6 mb-2 w-80 max-w-screen-lg sm:w-96 flex flex-col gap-6" onSubmit={handleSubmit}
            method="post">

        <div className="flex flex-col gap-2">
          <Typography
            variant="h6"
            color={nameError && displayNameError ? "red" : "blue-gray"}>
            Name
          </Typography>
          <Input
            name="name"
            type="text"
            size="lg"
            label="Name"
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            value={name}
            aria-invalid={nameError ? "true" : "false"}
            error={nameError && displayNameError}
            required
          />
          <Typography
            variant="small"
            color="red"
            className={classNames(
              'flex items-center gap-1 font-normal',
              nameError && displayNameError ? '' : 'hidden'
            )}>
            <ExclamationCircleIcon className="w-1/12"/>
            <span className="w-11/12">
              Should be from 2 to 24 characters long, lowercase and digits allowed
            </span>
          </Typography>
        </div>

        <div>
          <Button className="block rounded capitalize" type="submit" disabled={!name || nameError || submitting}>
            {submitting ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </Form>
    </>
  );
}