import { Link, useLoaderData } from "react-router-dom";
import { List, ListItem } from "@material-tailwind/react";

export default function Category() {
  const { category, questions } = useLoaderData();

  return (
    <>
      <h1 className="capitalize">{category.name}</h1>

      <List>
        {questions.map(question => {
          return <ListItem key={question.id}>
            <Link key={question.id} to={`/questions/${question.id}`}>
              {question.title}
            </Link>
          </ListItem>;
        })}
      </List>
    </>
  );
}