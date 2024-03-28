import { Link } from 'react-router-dom'
import Route from '../enum/Route'
import { Breadcrumbs, Button, Typography } from '@material-tailwind/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import React, { ReactNode } from 'react'

export default (): ReactNode => <>
  <Breadcrumbs>
    <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
  </Breadcrumbs>

  <Typography variant="h1" className="mt-1">Not Found</Typography>

  <Typography variant="small" className="mt-1">Page not found</Typography>

  <Link to={ Route.HOME }>
    <Button className="flex items-center mt-3">
      <HomeIcon className="h-4 w-4 mr-1"/> Go Home
    </Button>
  </Link>
</>
