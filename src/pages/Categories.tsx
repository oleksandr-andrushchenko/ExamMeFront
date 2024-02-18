import { Link, useLoaderData } from "react-router-dom";
import { Button, List, ListItem, Typography } from '@material-tailwind/react';
import Category from "../schema/Category";
import Route from "../enum/Route";
import useAuth from "../hooks/useAuth";
import { Squares2X2Icon, SquaresPlusIcon } from "@heroicons/react/24/solid";
import React from "react";
import Permission from "../enum/Permission";
import Spinner from "../components/Spinner.tsx";

export default () => {
  const categories = useLoaderData() as Category[];
  const { authLoading, checkAuth } = useAuth();

  return (
    <>
      <Typography variant="h1" color="blue-gray" className="flex items-baseline">
        <Squares2X2Icon className="inline-block h-8 w-8 mr-1"/> Categories
      </Typography>
      <Typography variant="small" color="gray" className="mt-1 font-normal">
        Available categories
      </Typography>

      <List>
        {categories.map(category => {
          return <ListItem key={category.id}>
            <Link
              key={category.id}
              to={Route.CATEGORY.replace(':categoryId', category.id)}>
              {category.name}
            </Link>
          </ListItem>;
        })}
      </List>

      {authLoading
        ? <Spinner/>
        : checkAuth(Permission.CREATE_CATEGORY) && <Link
        to={Route.ADD_CATEGORY}>
        <Button
          size="sm"
          className="rounded capitalize font-normal mt-3">
          <SquaresPlusIcon className="inline-block h-4 w-4"/> Add Category
        </Button>
      </Link>}
    </>
  );
}