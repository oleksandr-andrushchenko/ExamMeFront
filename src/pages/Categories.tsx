import { Link } from 'react-router-dom'
import { Breadcrumbs, Card, Chip, List, ListItem, ListItemSuffix, Typography } from '@material-tailwind/react'
import Category from '../schema/Category'
import Route from '../enum/Route'
import useAuth from '../hooks/useAuth'
import { HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode, useEffect, useState } from 'react'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import getCategories from '../api/category/getCategories'
import AddCategory from '../components/category/AddCategory'
import AddQuestion from '../components/question/AddQuestion'
import DeleteCategory from '../components/category/DeleteCategory'

export default (): ReactNode => {
  const [ categories, setCategories ] = useState<Category[] | undefined>(undefined)
  const { auth, me, checkAuth } = useAuth()


  const refresh = (): void => {
    getCategories().then((categories): void => setCategories(categories))
  }
  useEffect(refresh, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon
        className="inline-block w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
    </Breadcrumbs>
    <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">Categories</Typography>
    <Typography variant="small" color="gray" className="mt-1 font-normal">
      Available categories
    </Typography>

    { categories === undefined ? <Spinner/> : <Card>
      <List>
        { categories.map((category: Category, index: number): ReactNode => <ListItem key={ category.id }>
          <Link
            key={ category.id }
            to={ Route.CATEGORY.replace(':categoryId', category.id) }>
            <Chip
              variant="ghost"
              value={ index + 1 }
              className="rounded-full inline-block"
            /> { category.name }
          </Link>

          <ListItemSuffix>
            <Chip
              value={ category.questionCount }
              className="rounded-full inline-block"
            />

            { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_QUESTION) &&
              <AddQuestion category={ category } onSubmit={ refresh } iconButton/> }

            { auth && me === undefined ? <Spinner/> : checkAuth(Permission.UPDATE_CATEGORY) &&
              <AddCategory category={ category } onSubmit={ refresh } iconButton/> }

            { auth && me === undefined ? <Spinner/> : checkAuth(Permission.DELETE_CATEGORY) &&
              <DeleteCategory category={ category } onSubmit={ refresh } iconButton/> }
          </ListItemSuffix>
        </ListItem>) }
      </List>
    </Card> }

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_CATEGORY) && <AddCategory/> }
  </>
}