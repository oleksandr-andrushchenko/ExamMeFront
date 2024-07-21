import { Typography } from '@material-tailwind/react'
import React, { memo } from 'react'
import Subtitle from './Subtitle'

const H3 = ({ icon, label, sub, children, ...props }) => {
  const h3 = (
    <Typography as="h3" variant="h4" className="font-primary font-normal" { ...props }>
      { icon && React.createElement(icon, { className: 'h-8 w-8 inline-block' }) }
      { icon && ' ' }
      { label || children }
    </Typography>
  )

  if (sub) {
    return <>{ h3 } <Subtitle>{ sub }</Subtitle></>
  }

  return h3
}

export default memo(H3)