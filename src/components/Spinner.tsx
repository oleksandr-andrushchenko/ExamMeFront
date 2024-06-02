import { Button, Spinner as TailwindSpinner, Typography } from '@material-tailwind/react'
import React, { ReactNode } from 'react'

interface Props {
  type?: 'button' | 'text'
  height?: number
  width?: number
  children?: React.ReactNode
}

export default function Spinner({ type, height, width, children }: Props): ReactNode {
  if (type === 'button') {
    return (
      <span className="animate-pulse">
        <Button
          disabled
          tabIndex={ -1 }
          className={ `${ height ?? 'h-8' } ${ width ?? 'w-24' } bg-gray-300 shadow-none hover:shadow-none` }
        >
        { children }
      </Button>
      </span>
    )
  }

  if (type === 'text') {
    return (
      <Typography
        as="span"
        className={ `animate-pulse inline-block ${ height ?? 'h-2' } ${ width ?? 'w-24' } rounded-full bg-gray-300` }
      >
        { children }
      </Typography>
    )
  }

  return (
    <TailwindSpinner className="h-8 w-8 text-gray-900/50"/>
  )
}
