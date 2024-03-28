import { Breadcrumbs, Typography } from '@material-tailwind/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import Route from '../enum/Route'
import { ReactNode } from 'react'

export default (): ReactNode => <>
  <Breadcrumbs>
    <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
    <Link to={ Route.TERMS_AND_CONDITIONS }>Terms and conditions</Link>
  </Breadcrumbs>

  <Typography variant="h1" className="mt-1">Terms and conditions</Typography>

  <Typography variant="small" className="mt-1">Our rules and policies</Typography>
</>