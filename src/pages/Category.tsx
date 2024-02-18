import { Link, useLoaderData } from "react-router-dom";
import { Button, List, ListItem, Typography } from "@material-tailwind/react";
import { CategoryAndQuestions } from "../loaders/getCategoryAndQuestions";
import Route from "../enum/Route";
import { CubeIcon, SquaresPlusIcon } from "@heroicons/react/24/solid";
import React from "react";
import useAuth from "../hooks/useAuth";

export default () => {
  const [ category, questions ]: CategoryAndQuestions = useLoaderData();
  const { auth } = useAuth();

  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <CubeIcon className="inline-block h-8 w-8 mr-1"/> <span className="capitalize">{category.name}</span>
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Available questions
      </Typography>

      <List>
        {questions.map(question => {
          return <ListItem key={question.id}>
            <Link
              key={question.id}
              to={Route.QUESTION.replace(':categoryId', question.category).replace(':questionId', question.id)}>
              {question.title}
            </Link>
          </ListItem>;
        })}
      </List>

      {auth && <Link
        to={Route.ADD_QUESTION.replace(':categoryId', category.id)}>
        <Button
          size="sm"
          className="rounded capitalize font-normal mt-3">
          <SquaresPlusIcon className="inline-block h-4 w-4"/> Add Question
        </Button>
      </Link>}
    </>
  );
}