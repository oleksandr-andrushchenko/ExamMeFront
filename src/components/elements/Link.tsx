import React, { memo } from 'react'
import { Link as RrdLink } from 'react-router-dom'
import { Tooltip } from '@material-tailwind/react' // Assuming you're using React Router

const Link = ({ label, to, tooltip, className, icon, iconSize = 4, children, ...props }) => {
  const link = (
    <RrdLink
      { ...props }
      to={ to }
      className={ className }
    >
      { icon && React.createElement(icon, { className: `inline-block h-${ iconSize } w-${ iconSize } align-top` }) }
      { icon && ' ' }
      { label || children }
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
