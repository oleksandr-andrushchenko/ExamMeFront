import { useLoaderData } from "react-router-dom";
import { List, ListItem } from '@material-tailwind/react';
import { Link } from "react-router-dom";
import Category from "../schema/Category";
import RoutePath from "../schema/RoutePath";

export default function Categories() {
  const categories = useLoaderData() as Category[];

  return (
    <>
      <h1>Categories</h1>

      <List>
        {categories.map(category => {
          return <ListItem key={category.id}>
            <Link
              key={category.id}
              to={RoutePath.CATEGORY.replace(':categoryId', category.id)}>
              {category.name}
            </Link>
          </ListItem>;
        })}
      </List>
    </>
  );
}