import { Breadcrumbs } from '@material-tailwind/react'
import { HomeIcon } from '@heroicons/react/24/solid'
import Route from '../enum/Route'
import { memo, useEffect } from 'react'
import H1 from '../components/typography/H1'
import Link from '../components/elements/Link'

const Home = () => {
  useEffect(() => {
    document.title = 'ExamMe'
  }, [])

  return <>
    <Breadcrumbs>
      <Link icon={ HomeIcon } label="Home" to={ Route.Home }/>
    </Breadcrumbs>

    <H1 label="Home" sub="Latest activities"/>
  </>
}

export default memo(Home)