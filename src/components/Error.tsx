import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { Typography } from '@material-tailwind/react'
import { memo } from 'react'
import Text from './typography/Text'

interface Props {
  text: string
  simple?: boolean
}

const Error = ({ text, simple }: Props) => {
  console.log(text)

  if (simple) {
    return (
      <Typography color="red">
        <ExclamationCircleIcon className="inline-block h-5 w-5"/> { text.toString() }
      </Typography>
    )
  }

  return (
    <Text
      icon={ ExclamationCircleIcon }
      label={ text.toString() }
      variant="small"
      color="red"
      className="flex items-center gap-1 font-normal"
    />
  )
}

export default memo(Error)