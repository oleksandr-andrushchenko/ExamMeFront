import { Link, useLoaderData } from "react-router-dom";
import { List, ListItem } from "@material-tailwind/react";
import { CategoryAndQuestions } from "../loaders/getCategoryAndQuestions";
import RoutePath from "../schema/RoutePath";

export default function Category() {
  const [ category, questions ]: CategoryAndQuestions = useLoaderData();

  return (
    <>
      <h1 className="capitalize">{category.name}</h1>

      <List>
        {questions.map(question => {
          return <ListItem key={question.id}>
            <Link
              key={question.id}
              to={RoutePath.QUESTION.replace(':categoryId', question.category).replace(':questionId', question.id)}>
              {question.title}
            </Link>
          </ListItem>;
        })}
      </List>
    </>
  );
}