import { IconButton as MlIconButton, Tooltip } from '@material-tailwind/react'
import { ComponentProps, createElement, memo } from 'react'

interface Props extends ComponentProps<'button'> {
  icon?: any
  tooltip?: any
  size?: any
  className?: string
  onClick: Function
  disabled?: boolean
  type?: any
  variant?: any
  color?: any
  key?: any
}

const IconButton = (
  {
    icon,
    tooltip,
    size,
    className,
    onClick,
    disabled,
    type,
    variant,
    color,
    ...props
  }: Props,
) => {
  const button = (
    <MlIconButton
      { ...props }
      variant={ variant }
      color={ color }
      size={ size }
      type={ type }
      className={ className }
      onClick={ onClick }
      disabled={ disabled }
    >
      { createElement(icon, { className: 'h-4 w-4 align-top' }) }
    </MlIconButton>
  )

  if (tooltip) {
    return (
      <Tooltip content={ tooltip }>{ button }</Tooltip>
    )
  }

  return button
}

export default memo(IconButton)