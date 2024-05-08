import React, { useState } from 'react'
import { Rating, Typography } from '@material-tailwind/react'
import { StarIcon as UnratedIcon } from '@heroicons/react/24/outline'
import { StarIcon as RatedIcon } from '@heroicons/react/24/solid'

interface Props {
  value: number
  number?: boolean
  total?: number
  onChange?: () => void
  readonly?: boolean
}

export default ({ value = Math.ceil(Math.random() * 5), number = false, total, readonly = false }: Props) => {
  const [ rated, setRated ] = useState(value)

  return (
    <div className="flex items-center gap-2">
      { number && <Typography type="small">{ rated }.7</Typography> }
      <Rating value={ value }
              onChange={ (value) => setRated(value) }
              ratedIcon={ <RatedIcon/> }
              unratedIcon={ <UnratedIcon/> }
              readonly={ readonly }/>
      { (total > 0) && <Typography type="small">Based on { total } Reviews</Typography> }
    </div>
  )
}