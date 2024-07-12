import { memo, useState } from 'react'
import { Rating as MlRating, Typography } from '@material-tailwind/react'
import { Star as UnratedIcon, StarFill as RatedIcon } from 'react-bootstrap-icons'

interface Props {
  value: number
  number?: boolean
  total?: number
  onChange?: () => void
  readonly?: boolean
}

const Rating = ({ value = Math.ceil(Math.random() * 5), number = false, total, readonly = false }: Props) => {
  const [ rated, setRated ] = useState(value)

  return (
    <div className="flex items-center gap-2">
      { number && <Typography type="small">{ rated }.7</Typography> }
      <MlRating
        value={ value }
        onChange={ (value) => setRated(value) }
        ratedIcon={ <RatedIcon className="h-5 w-5 mr-1"/> }
        unratedIcon={ <UnratedIcon className="h-5 w-5 mr-1"/> }
        readonly={ readonly }
      />
      { (total > 0) && <Typography type="small">Based on { total } Reviews</Typography> }
    </div>
  )
}

export default memo(Rating)