import { Link } from 'react-router-dom'
import Route from '../enum/Route'
import { Breadcrumbs, Button, Typography } from '@material-tailwind/react'
import { HomeIcon, PuzzlePieceIcon } from '@heroicons/react/24/solid'
import { ReactNode } from 'react'

export default (): ReactNode => <>
  <Breadcrumbs>
    <Link to={ Route.HOME } className="flex items-center"><HomeIcon
      className="inline-block w-4 h-4 mr-1"/> Home</Link>
  </Breadcrumbs>
  <Typography variant="h1" color="blue-gray" className="flex items-baseline mt-1">
    <PuzzlePieceIcon className="inline-block h-8 w-8 mr-1"/> Not Found
  </Typography>
  <Typography variant="small" color="gray" className="mt-1 font-normal">
    Page not found
  </Typography>
  <Link to={ Route.HOME }>
    <Button
      size="sm"
      className="mt-3">
      <HomeIcon className="inline-block h-4 w-4"/> Go Home
    </Button>
  </Link>
</>
