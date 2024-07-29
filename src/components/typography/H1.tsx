import { Typography } from '@material-tailwind/react'
import { ComponentProps, createElement, memo } from 'react'
import Subtitle from './Subtitle'

interface Props extends ComponentProps<any> {
  icon?: any
  label?: any
  sub?: any
  children?: any
  className?: string
}

const H1 = ({ icon, label, sub, children, className, ...props }: Props) => {
  const h1 = (
    <Typography as="h1" variant="h2" className={ `mt-1 font-primary text-black ${ className }` } { ...props }>
      { icon && createElement(icon, { className: 'h-8 w-8 inline-block' }) }
      { icon && ' ' }
      { label || children }
    </Typography>
  )

  if (sub) {
    return <>{ h1 } <Subtitle>{ sub }</Subtitle></>
  }

  return h1
}

export default memo(H1)