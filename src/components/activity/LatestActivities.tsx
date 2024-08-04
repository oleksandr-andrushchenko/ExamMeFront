import { ComponentProps, memo, useEffect, useState } from 'react'
import { apiQuery } from '../../api/apolloClient'
import Error from '../Error'
import Spinner from '../Spinner'
import getActivities from '../../api/activity/getActivities'
import Activity from '../../schema/activity/Activity'
import CategoryEvent from '../../enum/category/CategoryEvent'
import CategoryCreatedActivity from './CategoryCreatedActivity'
import CategoryApprovedActivity from './CategoryApprovedActivity'

interface Props extends ComponentProps<any> {
}

const renderers = {
  [CategoryEvent.Created]: (activity: Activity) => <CategoryCreatedActivity activity={ activity }/>,
  [CategoryEvent.Approved]: (activity: Activity) => <CategoryApprovedActivity activity={ activity }/>,
}

const LatestActivities = ({}: Props) => {
  const [ isLoading, setLoading ] = useState<boolean>(true)
  const [ activities, setActivities ] = useState<Activity[]>([])
  const [ error, setError ] = useState<string>('')

  useEffect(() => {
    apiQuery(
      getActivities({ size: 20 }),
      async (data: { activities: Activity[] }) => setActivities(data.activities),
      setError,
      setLoading,
    )
  }, [])

  if (isLoading) {
    return <Spinner/>
  }

  return <>
    { error && <Error text={ error }/> }

    { activities.map((activity: Activity, index: number) => (
      <div key={ index }>
        { activity.event in renderers ? renderers[activity.event](activity) : <></> }
      </div>
    )) }
  </>
}

export default memo(LatestActivities)