import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '@material-tailwind/react'
import Category from '../schema/category/Category'
import Route from '../enum/Route'
import useAuth from '../hooks/useAuth'
import { HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect, useState } from 'react'
import AddCategory from '../components/category/AddCategory'
import AddQuestion from '../components/question/AddQuestion'
import DeleteCategory from '../components/category/DeleteCategory'
import Paginated from '../schema/pagination/Paginated'
import Rating from '../components/Rating'
import getCategoriesForCategoriesPage from '../api/category/getCategoriesForCategoriesPage'
import AddExam from '../components/exam/AddExam'
import CategoryPermission from '../enum/category/CategoryPermission'
import H1 from '../components/typography/H1'
import { ListIcon } from '../registry/icons'
import Table from '../components/elements/Table'
import Link from '../components/elements/Link'
import isCategoryApproved from '../services/categories/isCategoryApproved'
import YesNo from '../components/elements/YesNo'

const Categories = () => {
  const [ tableKey, setTableKey ] = useState<number>(0)
  const refresh = () => setTableKey(Math.random())
  const { checkAuthorization } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Categories'
  }, [])

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
      <Link label="Categories" to={ Route.Categories }/>
    </Breadcrumbs>

    <H1 icon={ ListIcon } label="Categories" sub="Categories info"/>

    <Table
      key2={ tableKey }
      buttons={ {
        create: <AddCategory
          onSubmit={ (category: Category) => navigate(Route.Category.replace(':categoryId', category.id!)) }/>,
      } }
      tabs={ {
        subscription: [ 'yes', 'no' ],
        approved: [ 'yes', 'no' ],
      } }
      columns={ [ '#', 'Name', 'Questions', 'Required score', 'Approved', 'Rating', '' ] }
      // todo: add current exam info (get rid off getOneNonCompletedCategoryExams calls)
      queryOptions={ (filter) => getCategoriesForCategoriesPage(filter) }
      queryData={ (data: { paginatedCategories: Paginated<Category> }) => data.paginatedCategories }
      mapper={ (category: Category, index: number) => [
        category.id,
        index + 1,
        <Link label={ category.name } tooltip={ category.name }
              to={ Route.Category.replace(':categoryId', category.id!) }/>,
        category.questionCount ?? 0,
        category.requiredScore ?? 0,
        <YesNo yes={ isCategoryApproved(category) }/>,
        <Rating readonly/>,
        <span className="flex justify-end gap-1">
          <AddQuestion category={ category } onSubmit={ refresh } iconButton/>

          { checkAuthorization(CategoryPermission.Update, category) &&
            <AddCategory category={ category } onSubmit={ refresh } iconButton/> }

          { checkAuthorization(CategoryPermission.Delete, category) &&
            <DeleteCategory category={ category } onSubmit={ refresh } iconButton/> }

          { !!category.questionCount && <AddExam category={ category } iconButton/> }
        </span>,
      ] }
    />
  </>
}

export default memo(Categories)