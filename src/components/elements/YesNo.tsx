import { memo } from 'react'
import { Chip } from '@material-tailwind/react'

const YesNo = ({ yes }) => {
  return yes ? <Chip value="Yes" color="green"/> : <Chip value="No" color="orange"/>
}

export default memo(YesNo)