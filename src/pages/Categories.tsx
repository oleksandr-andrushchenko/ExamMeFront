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
import getCategoriesForCategoriesPage from '../api/category/getCategoriesForCategoriesPage'
import AddExam from '../components/exam/AddExam'
import CategoryPermission from '../enum/category/CategoryPermission'
import H1 from '../components/typography/H1'
import { ListIcon } from '../registry/icons'
import Table from '../components/elements/Table'
import Link from '../components/elements/Link'
import { ApproveCategory } from '../components/category/ApproveCategory'
import { default as YesNoEnum } from '../enum/YesNo'
import canAddExam from '../services/exams/canAddExam'
import CreatorBadge from '../components/badges/CreatorBadge'
import { RateCategory } from '../components/category/RateCategory'

const Categories = () => {
  const [ tableKey, setTableKey ] = useState<number>(0)
  const refresh = () => setTableKey(Math.random())
  const { authenticationToken, checkAuthorization } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    refresh()
  }, [ authenticationToken ])

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
        // subscription: Object.values(YesNoEnum),
        approved: Object.values(YesNoEnum),
        // creator: authenticationToken ? Object.values(Creator) : '',
      } }
      columns={ [ '#', 'Name', 'Questions', 'Required score', 'Approved', 'Rating', '' ] }
      queryOptions={ (filter) => getCategoriesForCategoriesPage(filter) }
      queryData={ (data: { paginatedCategories: Paginated<Category> }) => data.paginatedCategories }
      mapper={ (category: Category, index: number) => [
        category.id,
        index + 1,
        <Link
          label={ category.name }
          sup={ category.isCreator ? <CreatorBadge/> : '' }
          tooltip={ category.name }
          to={ Route.Category.replace(':categoryId', category.id!) }
        />,
        `${ category.approvedQuestionCount ?? 0 }/${ category.questionCount ?? 0 }`,
        category.requiredScore ?? 0,
        <ApproveCategory category={ category } readonly={ !checkAuthorization(CategoryPermission.Approve) }
                         iconButton/>,
        <RateCategory category={ category } readonly={ !checkAuthorization(CategoryPermission.Rate) }/>,
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