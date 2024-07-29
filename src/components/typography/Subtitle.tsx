import { Typography } from '@material-tailwind/react'
import { ComponentProps, memo } from 'react'

interface Props extends ComponentProps<any> {
  label?: any
  children?: any
  className?: string
}

const Subtitle = ({ label, children, ...props }: Props) => {
  return <Typography variant="small" className="mt-1" { ...props }>
    { label || children }
  </Typography>
}

export default memo(Subtitle)