import { Breadcrumbs, Typography } from '@material-tailwind/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import Route from '../enum/Route'
import { memo, useEffect } from 'react'
import H1 from '../components/typography/H1'
import Link from '../components/elements/Link'

const Home = () => {
  useEffect(() => {
    document.title = 'ExamMe'
  }, [])

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
    </Breadcrumbs>

    <H1>Home</H1>

    <Typography variant="small" className="mt-1">Latest activities</Typography>
  </>
}

export default memo(Home)