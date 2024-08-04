import { ComponentProps, memo } from 'react'
import Activity from '../../schema/activity/Activity'
import Route from '../../enum/Route'
import Link from '../elements/Link'
import AddExam from '../exam/AddExam'

interface Props extends ComponentProps<any> {
  activity: Activity
}

const CategoryApprovedActivity = ({ activity }: Props) => {
  const category = { id: activity.categoryId! }
  const link = Route.Category.replace(':categoryId', category.id)

  return <>
    <b><Link label={ activity.categoryName } to={ link }/></b>
    { ' ' }
    category has been approved. You can start your exam
    { ' ' }
    <b><Link label="here" to={ link }/></b>
    { ' ' }
    or
    { ' ' }
    <AddExam category={ category }/>
  </>
}

export default memo(CategoryApprovedActivity)