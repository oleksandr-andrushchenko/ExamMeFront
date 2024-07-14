import { Breadcrumbs, Typography } from '@material-tailwind/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import Route from '../enum/Route'
import { memo, useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    document.title = 'ExamMe'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.Home } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">Home</Typography>

    <Typography variant="small" className="mt-1">Latest activities</Typography>
  </>
}

export default memo(Home)