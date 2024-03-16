import { Breadcrumbs, Typography } from '@material-tailwind/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import Route from '../enum/Route'
import { ReactNode } from 'react'

export default (): ReactNode => <>
  <Breadcrumbs>
    <Link to={ Route.HOME } className="flex items-center"><HomeIcon
      className="inline-block w-4 h-4 mr-1"/> Home</Link>
  </Breadcrumbs>
  <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">Home</Typography>
  <Typography variant="small" color="gray" className="mt-1 font-normal">
    Latest activities
  </Typography>
</>