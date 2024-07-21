import { Typography } from '@material-tailwind/react'
import React, { memo } from 'react'

const H1 = ({ icon, label, sub, children, ...props }) => {
  const h1 = (
    <Typography as="h1" variant="h2" className="mt-1 font-primary" { ...props }>
      { icon && React.createElement(icon, { className: 'h-8 w-8 inline-block' }) }
      { icon && ' ' }
      { label || children }
    </Typography>
  )

  if (sub) {
    return <>{ h1 } { sub }</>
  }

  return h1
}

export default memo(H1)