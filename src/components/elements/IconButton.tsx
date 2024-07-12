import { IconButton as MlIconButton, Tooltip } from '@material-tailwind/react'
import React, { memo } from 'react'

const IconButton = ({ icon, tooltip, onClick, disabled, ...props }) => {
  const button = (
    <MlIconButton { ...props } onClick={ onClick } disabled={ disabled }>
      { React.createElement(icon, { className: 'h-4 w-4 align-top' }) }
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