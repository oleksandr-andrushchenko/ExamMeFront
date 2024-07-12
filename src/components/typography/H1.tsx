import { Typography } from '@material-tailwind/react'
import React, { memo } from 'react'

const H1 = ({ icon, label, children }) => {
  return <Typography as="h1" variant="h2" className="mt-1">
    { React.createElement(icon, { className: 'h-8 w-8 inline-block align-middle' }) }
    <span className="align-top">{ label ?? children }</span>
  </Typography>
}

export default memo(H1)