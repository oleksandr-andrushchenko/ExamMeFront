import { Button as MlButton } from '@material-tailwind/react'
import React, { memo } from 'react'

const Button = ({ label, size, className, icon, onClick, disabled, type = 'button', variant, children, ...props }) => {
  return (
    <MlButton { ...props } variant={ variant } size={ size } type={ type } className={ className } onClick={ onClick }
              disabled={ disabled }>
      { icon && React.createElement(icon, { className: 'inline-block h-4 w-4 align-top' }) }
      { icon && ' ' }
      { label || children }
    </MlButton>
  )
}

export default memo(Button)