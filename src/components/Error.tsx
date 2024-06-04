import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { Typography } from '@material-tailwind/react'
import React from 'react'

interface Props {
  text: string
  simple?: boolean
}

export default function Error({ text, simple }: Props) {
  if (simple) {
    return (
      <Typography color="red">
        <ExclamationCircleIcon className="inline-block h-5 w-5"/> { text }
      </Typography>
    )
  }

  return (
    <Typography
      variant="small"
      color="red"
      className="flex items-center gap-1 font-normal">
      <ExclamationCircleIcon className="w-1/12"/>
      <span className="w-11/12">{ text }</span>
    </Typography>
  )
}