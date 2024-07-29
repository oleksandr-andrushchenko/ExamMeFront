import { Typography } from '@material-tailwind/react'
import { ComponentProps, createElement, memo } from 'react'

interface Props extends ComponentProps<any> {
  icon?: any
  label?: any
  children?: any
  variant?: any
  color?: any
  className?: string
}

const Text = ({ icon, label, children, variant, color, className }: Props) => {
  return <Typography as="span" variant={ variant } color={ color } className={ className }>
    { icon && createElement(icon, { className: 'h-4 w-4 inline-block' }) }
    { icon && ' ' }
    { label || children }
  </Typography>
}

export default memo(Text)