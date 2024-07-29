import { Button as MlButton, Tooltip } from '@material-tailwind/react'
import { ComponentProps, createElement, memo } from 'react'

interface Props extends ComponentProps<'button'> {
  label?: string
  tooltip?: string
  size?: any
  className?: string
  icon?: any
  onClick: Function
  disabled?: boolean
  type?: any
  variant?: any
  color?: any
  children?: any
  key?: any
}

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
  }: Props,
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
      { icon && createElement(icon, { className: 'inline-block h-4 w-4 align-top' }) }
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