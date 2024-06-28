import { Breadcrumbs, Typography } from '@material-tailwind/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import Route from '../enum/Route'
import { memo, useEffect } from 'react'

const Terms = () => {
  useEffect(() => {
    document.title = 'Terms and conditions'
  }, [])

  return <>
    <Breadcrumbs>
      <Link to={ Route.HOME } className="flex items-center"><HomeIcon className="w-4 h-4 mr-1"/> Home</Link>
      <Link to={ Route.TERMS }>Terms and conditions</Link>
    </Breadcrumbs>

    <Typography as="h1" variant="h2" className="mt-1">Terms and conditions</Typography>

    <Typography variant="small" className="mt-1">Our rules and policies</Typography>
  </>
}

export default memo(Terms)