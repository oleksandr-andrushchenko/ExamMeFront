import { useLoaderData } from "react-router-dom";
import { List, ListItem } from '@material-tailwind/react';
import { Link } from "react-router-dom";

export default function Categories() {
  const categories = useLoaderData();

  return (
    <>
      <h1>Categories</h1>

      <List>
        {categories.map(category => {
          return <ListItem key={category.id}>
            <Link key={category.id} to={`/categories/${category.id}`}>
              {category.name}
            </Link>
          </ListItem>;
        })}
      </List>
    </>
  );
}