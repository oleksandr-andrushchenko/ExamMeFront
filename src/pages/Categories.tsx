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
import YesNo from '../components/elements/YesNo'
import ApproveCategory from '../components/category/ApproveCategory'
import { default as YesNoEnum } from '../enum/YesNo'
import canAddExam from '../services/exams/canAddExam'
import apolloClient from '../api/apolloClient'
import getCurrentExams from '../api/exam/getCurrentExams'
import Exam from '../schema/exam/Exam'
import CreatorBadge from '../components/badges/CreatorBadge'
import Creator from '../enum/Creator'

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

  const queryData = async (data: { paginatedCategories: Paginated<Category> }, { setError, setLoading }) => {
    const queryData = {
      ...data.paginatedCategories,
      ...{ data: data.paginatedCategories.data.map((category: Category) => ({ category })) },
    }

    if (!authenticationToken) {
      return queryData
    }

    const categoryIds = queryData.data
      .filter(({ category }: { category: Category }) => canAddExam(category))
      .map(({ category }: { category: Category }) => category.id!)

    if (categoryIds.length === 0) {
      return queryData
    }

    setLoading(true)

    try {
      const examsRes = await apolloClient.query<{ currentExams: Exam[] }>({
        errorPolicy: 'all',
        fetchPolicy: 'network-only',
        ...getCurrentExams(categoryIds),
      })

      queryData.data = queryData.data.map(({ category }: { category: Category }) => {
        for (const exam of examsRes.data.currentExams) {
          if (exam.categoryId === category.id) {
            return { category, exam }
          }
        }

        return { category, exam: null }
      })
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }

    return queryData
  }

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
        creator: authenticationToken ? Object.values(Creator) : '',
      } }
      columns={ [ '#', 'Name', 'Questions', 'Required score', 'Approved', 'Rating', '' ] }
      queryOptions={ (filter) => getCategoriesForCategoriesPage(filter) }
      queryData={ queryData }
      mapper={ ({ category, exam }: { category: Category, exam: Exam }, index: number) => [
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
        checkAuthorization(CategoryPermission.Approve)
          ? <ApproveCategory category={ category } onSubmit={ refresh } iconButton/>
          : <YesNo yes={ category.isApproved }/>,
        <Rating readonly/>,
        {
          addQuestion: <AddQuestion category={ category } onSubmit={ refresh } iconButton/>,

          update: checkAuthorization(CategoryPermission.Update, category) &&
            <AddCategory category={ category } onSubmit={ refresh } iconButton/>,

          delete: checkAuthorization(CategoryPermission.Delete, category) &&
            <DeleteCategory category={ category } onSubmit={ refresh } iconButton/>,

          exam: canAddExam(category) && <AddExam category={ category } exam={ exam } iconButton/>,
        },
      ] }
    />
  </>
}

export default memo(Categories)