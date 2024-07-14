import { useNavigate } from 'react-router-dom'
import { Breadcrumbs, Typography } from '@material-tailwind/react'
import Route from '../enum/Route'
import { memo, useEffect } from 'react'
import Auth from '../components/Auth'
import H1 from '../components/typography/H1'
import Button from '../components/elements/Button'
import { GoBackIcon, HomeIcon } from '../registry/icons'
import Link from '../components/elements/Link'

const Unauthenticated = () => {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  useEffect(() => {
    document.title = 'Unauthenticated'
  }, [])

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
    </Breadcrumbs>

    <H1>Unauthenticated</H1>

    <Typography variant="small" className="mt-1">You do not logged in</Typography>

    <div className="inline-flex items-center gap-1 mt-3">
      <Auth/>
      <Button icon={ GoBackIcon } label="Go Back" onClick={ goBack }/>
      <Link label={ <Button icon={ HomeIcon } label="Go Home" size="md"/> } to={ Route.Home }/>
    </div>
  </>
}

export default memo(Unauthenticated)
