import { ComponentProps, createElement, memo } from 'react'
import { Link as RrdLink } from 'react-router-dom'
import { Tooltip } from '@material-tailwind/react'

interface Props extends ComponentProps<any> {
  label?: any
  to?: any
  tooltip?: any
  className?: string
  icon?: any
  iconSize?: any
  children?: any
  sup?: any
  key?: any
}

const Link = ({ label, to, tooltip, className, icon, iconSize = 4, children, sup, ...props }: Props) => {
  const link = (
    <RrdLink
      { ...props }
      to={ to }
      className={ className }
    >
      { icon && createElement(icon, { className: `inline-block h-${ iconSize } w-${ iconSize } align-top` }) }
      { icon && ' ' }
      { label || children }
      { sup && ' ' }
      { sup && <sup>{ sup }</sup> }
    </RrdLink>
  )
  if (tooltip) {
    return (
      <Tooltip content={ tooltip }>
        { link }
      </Tooltip>
    )
  }


  return link
}

export default memo(Link)
