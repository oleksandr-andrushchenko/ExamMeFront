import { ComponentProps, memo } from 'react'
import { Chip } from '@material-tailwind/react'

interface Props extends ComponentProps<any> {
  yes?: boolean
}

const CreatorBadge = ({ yes = true }: Props) => {
  return yes ? <Chip value="Created by you" color="red" className="font-normal"/> : ''
}

export default memo(CreatorBadge)