import { Typography } from '@material-tailwind/react'
import React, { memo } from 'react'

const Subtitle = ({ label, children, ...props }) => {
  return <Typography variant="small" className="mt-1" { ...props }>
    { label || children }
  </Typography>
}

export default memo(Subtitle)