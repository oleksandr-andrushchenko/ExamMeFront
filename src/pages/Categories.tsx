import { Link } from 'react-router-dom'
import { Breadcrumbs, Chip, List, ListItem, Typography } from '@material-tailwind/react'
import Category from '../schema/Category'
import Route from '../enum/Route'
import useAuth from '../hooks/useAuth'
import { HomeIcon, Squares2X2Icon } from '@heroicons/react/24/solid'
import { ReactNode, useEffect, useState } from 'react'
import Permission from '../enum/Permission'
import Spinner from '../components/Spinner'
import getCategories from '../api/category/getCategories'
import AddCategory from '../components/category/AddCategory'

export default (): ReactNode => {
  const [ categories, setCategories ] = useState<Category[] | undefined>(undefined)
  const { auth, me, checkAuth } = useAuth()

  useEffect((): void => {
    getCategories().then((categories): void => setCategories(categories))
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon
        className="inline-block w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.CATEGORIES }>Categories</Link>
    </Breadcrumbs>
    <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">
      <Squares2X2Icon className="inline-block h-8 w-8 mr-1"/> Categories
    </Typography>
    <Typography variant="small" color="gray" className="mt-1 font-normal">
      Available categories
    </Typography>

    { categories === undefined ? <Spinner/> : <List>
      { categories.map((category: Category, index: number): ReactNode => <ListItem key={ category.id }>
        <Link
          key={ category.id }
          to={ Route.CATEGORY.replace(':categoryId', category.id) }>
          <Chip
            variant="ghost"
            value={ index + 1 }
            className="rounded-full inline-block"
          /> { category.name } <Chip
          value={ category.questionCount }
          className="rounded-full inline-block"
        />
        </Link>
      </ListItem>) }
    </List> }

    { auth && me === undefined ? <Spinner/> : checkAuth(Permission.CREATE_CATEGORY) && <AddCategory/> }
  </>
}