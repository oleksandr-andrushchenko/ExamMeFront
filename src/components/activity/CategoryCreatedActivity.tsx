import { ComponentProps, memo } from 'react'
import Activity from '../../schema/activity/Activity'
import Route from '../../enum/Route'
import Link from '../elements/Link'
import AddQuestion from '../question/AddQuestion'

interface Props extends ComponentProps<any> {
  activity: Activity
}

const CategoryCreatedActivity = ({ activity }: Props) => {
  const category = { id: activity.categoryId! }
  const link = Route.Category.replace(':categoryId', category.id)

  return <>
    <b><Link label={ activity.categoryName } to={ link }/></b>
    { ' ' }
    category has been created. You can add your own questions
    { ' ' }
    <b><Link label="here" to={ link }/></b>
    { ' ' }
    or
    { ' ' }
    <AddQuestion category={ category }/>
  </>
}

export default memo(CategoryCreatedActivity)