import { Button, IconButton, Spinner as TailwindSpinner, Typography } from '@material-tailwind/react'
import { ComponentProps, memo, ReactNode } from 'react'

interface Props extends ComponentProps<any> {
  type?: 'button' | 'icon-button' | 'text'
  height?: number
  width?: number
  children?: ReactNode
}

const Spinner = ({ type, height, width, children }: Props) => {
  if (type === 'button') {
    return (
      <span className="animate-pulse">
        <Button
          disabled
          tabIndex={ -1 }
          className={ `${ height ?? 'h-8' } ${ width ?? 'w-24' } bg-gray-300 shadow-none hover:shadow-none` }
        >
        { children ?? '' }
      </Button>
      </span>
    )
  }

  if (type === 'icon-button') {
    return (
      <span className="animate-pulse">
        <IconButton disabled tabIndex={ -1 } className={ `bg-gray-300 shadow-none hover:shadow-none` }>
          &nbsp;
        </IconButton>
      </span>
    )
  }

  if (type === 'text') {
    return (
      <Typography
        as="span"
        className={ `animate-pulse inline-block ${ height ?? 'h-2' } ${ width ?? 'w-24' } rounded-full bg-gray-300` }
      >
        { children ?? '' }
      </Typography>
    )
  }

  return <TailwindSpinner className="h-8 w-8 text-gray-900/50"/>
}

export default memo(Spinner)
