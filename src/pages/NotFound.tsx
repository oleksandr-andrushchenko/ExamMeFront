import { Link, useNavigate } from 'react-router-dom'
import Route from '../enum/Route'
import { Breadcrumbs, Button, Typography } from '@material-tailwind/react'
import { ArrowUturnLeftIcon, HomeIcon } from '@heroicons/react/24/solid'
import { memo, useEffect } from 'react'

const NotFound = () => {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  useEffect(() => {
    document.title = 'Not Found'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">Not Found</Typography>

    <Typography variant="small" className="mt-1">Page not found</Typography>

    <div className="inline-flex items-center gap-1 mt-3">
      <Button onClick={ goBack }><ArrowUturnLeftIcon className="inline-block h-4 w-4"/> Go Back</Button>
      <Link to={ Route.HOME }><Button size="md"><HomeIcon className="inline-block h-4 w-4"/> Go Home</Button></Link>
    </div>
  </>
}

export default memo(NotFound)
