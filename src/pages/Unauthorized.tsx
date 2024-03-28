import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumbs, Button, Typography } from '@material-tailwind/react'
import { ArrowUturnLeftIcon, HomeIcon } from '@heroicons/react/24/solid'
import Route from '../enum/Route'
import { ReactNode } from 'react'

export default (): ReactNode => {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
    </Breadcrumbs>

    <Typography variant="h1" className="mt-1">Unauthorized</Typography>

    <Typography variant="small" className="mt-1">You do not have access to the requested page</Typography>

    <Button className="mt-3" onClick={ goBack }><ArrowUturnLeftIcon className="h-4 w-4"/> Go Back</Button>
  </>
}
