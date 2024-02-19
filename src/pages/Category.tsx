import { Link, useParams } from "react-router-dom";
import { Button, List, ListItem, Typography } from "@material-tailwind/react";
import Route from "../enum/Route";
import { CubeIcon, SquaresPlusIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Permission from "../enum/Permission";
import Spinner from "../components/Spinner";
import Category from "../schema/Category";
import Question from "../schema/Question";
import getCategory from "../api/getCategory";
import getCategoryQuestions from "../api/getCategoryQuestions";

interface Params {
  categoryId: string,
}

interface Data {
  category: Category | undefined,
  questions: Question[] | undefined,
}

export default () => {
  const { categoryId }: Params = useParams<Params>();
  const [ { category, questions }, setData ] = useState<Data>({ category: undefined, questions: undefined });
  const { auth, me, checkAuth } = useAuth();

  useEffect(() => {
    Promise.all<any>([ getCategory(categoryId), getCategoryQuestions(categoryId) ])
      .then(([ category, questions ]) => setData({ category, questions }))
  }, [])

  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <CubeIcon className="inline-block h-8 w-8 mr-1"/>
        <span className="capitalize">
          {category === undefined ? <Spinner/> : category.name}
        </span>
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Available questions
      </Typography>

      {questions === undefined ? <Spinner/> : <List>
        {questions.map(question => {
          return <ListItem key={question.id}>
            <Link
              key={question.id}
              to={Route.QUESTION.replace(':categoryId', question.category).replace(':questionId', question.id)}>
              {question.title}
            </Link>
          </ListItem>;
        })}
      </List>}

      {auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_QUESTION) && <Link
        to={Route.ADD_QUESTION.replace(':categoryId', categoryId)}>
        <Button
          size="sm"
          className="rounded capitalize font-normal mt-3">
          <SquaresPlusIcon className="inline-block h-4 w-4"/> Add Question
        </Button>
      </Link>}
    </>
  );
}