import { Typography } from '@material-tailwind/react'
import React, { memo } from 'react'

const H1 = ({ icon, label, children }) => {
  return <Typography as="span">
    { icon && React.createElement(icon, { className: 'h-4 w-4 inline-block' }) }
    { icon && ' ' }
    { label || children }
  </Typography>
}

export default memo(H1)