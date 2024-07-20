import { Button as MlButton, Tooltip } from '@material-tailwind/react'
import React, { memo } from 'react'

const Button = (
  {
    label,
    tooltip,
    size,
    className,
    icon,
    onClick,
    disabled,
    type,
    variant,
    color,
    children,
    ...props
  },
) => {
  const button = (
    <MlButton
      { ...props }
      variant={ variant }
      color={ color }
      size={ size }
      type={ type }
      className={ className }
      onClick={ onClick }
      disabled={ disabled }
    >
      { icon && React.createElement(icon, { className: 'inline-block h-4 w-4 align-top' }) }
      { icon && ' ' }
      { label || children }
    </MlButton>
  )

  if (tooltip) {
    return (
      <Tooltip content={ tooltip }>
        { disabled ? <div>{ button }</div> : button }
      </Tooltip>
    )
  }

  return button
}

export default memo(Button)