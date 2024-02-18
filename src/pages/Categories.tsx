import { useLoaderData } from "react-router-dom";
import { Button, List, ListItem } from '@material-tailwind/react';
import { Link } from "react-router-dom";
import Category from "../schema/Category";
import RoutePath from "../schema/RoutePath";
import useAuth from "../hooks/useAuth";
import { SquaresPlusIcon } from "@heroicons/react/16/solid";
import React from "react";

export default function Categories() {
  const categories = useLoaderData() as Category[];
  const { auth } = useAuth();

  return (
    <>
      <h1>Categories</h1>

      {auth && <Link
        to={RoutePath.ADD_CATEGORY}>
        <Button
          size="sm"
          className="rounded capitalize">
          <SquaresPlusIcon className="inline-block h-4 w-4"/> Add Category
        </Button>
      </Link>}

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