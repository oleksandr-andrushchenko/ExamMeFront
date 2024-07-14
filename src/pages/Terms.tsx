import { Breadcrumbs, Typography } from '@material-tailwind/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import Route from '../enum/Route'
import { memo, useEffect } from 'react'
import Link from '../components/elements/Link'
import H1 from '../components/typography/H1'

const Terms = () => {
  useEffect(() => {
    document.title = 'Terms and conditions'
  }, [])

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
      <Link label="Terms and conditions" to={ Route.Terms }/>
    </Breadcrumbs>

    <H1>Terms and conditions</H1>

    <Typography variant="small" className="mt-1">Our rules and policies</Typography>
  </>
}

export default memo(Terms)