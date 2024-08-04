import { ComponentProps, memo } from 'react'
import Activity from '../../schema/activity/Activity'
import Route from '../../enum/Route'
import Link from '../elements/Link'

interface Props extends ComponentProps<any> {
  activity: Activity
}

const CategoryCreatedActivity = ({ activity }: Props) => {
  const link = Route.Category.replace(':categoryId', activity.categoryId!)

  return <>
    <b><Link label={ activity.categoryName } to={ link }/></b>
    { ' ' }
    category has been created. You can add your own questions
    { ' ' }
    <b><Link label="here" to={ link }/></b>.
  </>
}

export default memo(CategoryCreatedActivity)