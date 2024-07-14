import React, { forwardRef, memo } from 'react'
import { Link as RrdLink } from 'react-router-dom' // Assuming you're using React Router

const Link = forwardRef(({ label, to, className, icon, children, ...props }, ref) => {
  return (
    <RrdLink ref={ ref } { ...props } to={ to } className={ className }>
      { icon && React.createElement(icon, { className: 'inline-block h-4 w-4 align-top' }) }
      { icon && ' ' }
      { label || children }
    </RrdLink>
  )
})

export default memo(Link)
