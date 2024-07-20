import { Typography } from '@material-tailwind/react'
import React, { memo } from 'react'

const Text = ({ icon, label, children, variant, color, className }) => {
  return <Typography as="span" variant={ variant } color={ color } className={ className }>
    { icon && React.createElement(icon, { className: 'h-4 w-4 inline-block' }) }
    { icon && ' ' }
    { label || children }
  </Typography>
}

export default memo(Text)