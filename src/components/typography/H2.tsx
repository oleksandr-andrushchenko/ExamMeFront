import { Typography } from '@material-tailwind/react'
import React, { memo } from 'react'

const H2 = ({ icon, label, children, className, ...props }) => {
  return <Typography as="h2" variant="h6" className={ `mt-4 text-black ${ className }` } { ...props }>
    { icon && React.createElement(icon, { className: 'h-4 w-4 inline-block' }) }
    { icon && ' ' }
    { label || children }
  </Typography>
}

export default memo(H2)