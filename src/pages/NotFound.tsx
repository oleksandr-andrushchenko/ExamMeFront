import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '@material-tailwind/react'
import Route from '../enum/Route'
import { memo, useEffect } from 'react'
import H1 from '../components/typography/H1'
import Button from '../components/elements/Button'
import Link from '../components/elements/Link'
import { GoBackIcon, HomeIcon } from '../registry/icons'

const NotFound = () => {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  useEffect(() => {
    document.title = 'Not Found'
  }, [])

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
    </Breadcrumbs>

    <H1 label="Not Found" sub="Page not found"/>

    <div className="inline-flex items-center gap-1 mt-3">
      <Button icon={ GoBackIcon } label="Go Back" onClick={ goBack }/>
      <Link label={ <Button icon={ HomeIcon } label="Go Home" size="md"/> } to={ Route.Home }/>
    </div>
  </>
}

export default memo(NotFound)
