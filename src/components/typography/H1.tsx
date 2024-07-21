import { Typography } from '@material-tailwind/react'
import React, { memo } from 'react'

const H1 = ({ icon, label, children, ...props }) => {
  return <Typography as="h1" variant="h2" className="mt-1 font-primary" { ...props }>
    { icon && React.createElement(icon, { className: 'h-8 w-8 inline-block' }) }
    { icon && ' ' }
    { label || children }
  </Typography>
}

export default memo(H1)