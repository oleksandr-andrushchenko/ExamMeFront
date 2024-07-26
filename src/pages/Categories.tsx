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
import ApproveCategory from '../components/category/ApproveCategory'
import { default as YesNoEnum } from '../enum/YesNo'
import canAddExam from '../services/categories/canAddExam'

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
        subscription: Object.values(YesNoEnum),
        approved: Object.values(YesNoEnum),
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
        `${ category.approvedQuestionCount ?? 0 }/${ category.questionCount ?? 0 }`,
        category.requiredScore ?? 0,
        checkAuthorization(CategoryPermission.Approve)
          ? <ApproveCategory category={ category } onSubmit={ refresh } iconButton/>
          : <YesNo yes={ isCategoryApproved(category) }/>,
        <Rating readonly/>,
        {
          addQuestion: <AddQuestion category={ category } onSubmit={ refresh } iconButton/>,

          update: checkAuthorization(CategoryPermission.Update, category) &&
            <AddCategory category={ category } onSubmit={ refresh } iconButton/>,

          delete: checkAuthorization(CategoryPermission.Delete, category) &&
            <DeleteCategory category={ category } onSubmit={ refresh } iconButton/>,

          exam: canAddExam(category) && <AddExam category={ category } iconButton/>,
        },
      ] }
    />
  </>
}

export default memo(Categories)