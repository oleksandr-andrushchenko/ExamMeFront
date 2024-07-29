import { Typography } from '@material-tailwind/react'
import { ComponentProps, createElement, memo } from 'react'

interface Props extends ComponentProps<any> {
  icon?: any
  label?: any
  children?: any
  className?: string
}

const H2 = ({ icon, label, children, className, ...props }: Props) => {
  return <Typography as="h2" variant="h6" className={ `mt-4 text-black ${ className }` } { ...props }>
    { icon && createElement(icon, { className: 'h-4 w-4 inline-block' }) }
    { icon && ' ' }
    { label || children }
  </Typography>
}

export default memo(H2)