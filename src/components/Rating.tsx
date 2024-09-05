import { ComponentProps, memo, useState } from 'react'
import { Rating as MlRating, Typography } from '@material-tailwind/react'
import { Star as UnratedIcon, StarFill as RatedIcon } from 'react-bootstrap-icons'
import { default as RatingValue } from '../schema/rating/Rating'
import Spinner from './Spinner'

interface Props extends ComponentProps<any> {
  rating: RatingValue | null
  showAverageMark?: boolean
  showMarkCount?: boolean
  onChange: (mark: number, callback: Function, setLoading: Function) => void
  readonly?: boolean
}

const Rating = (
  {
    rating = {},
    showAverageMark = false,
    showMarkCount = false,
    onChange = () => {
    },
    readonly = false,
  }: Props,
) => {
  const [ _rating, setRating ] = useState(rating)
  const [ isLoading, setLoading ] = useState(false)
  const { averageMark = 0, markCount = 0, mark } = _rating ?? {}
  const marked = mark !== null && mark !== undefined

  if (isLoading) {
    return (
      <Spinner/>
    )
  }

  return (
    <div className="flex items-center gap-2">
      { showAverageMark && (averageMark > 0) && <Typography type="small">{ averageMark }</Typography> }

      <MlRating
        value={ Math.floor(averageMark) }
        count={ 5 }
        onChange={ (mark: number) => onChange(mark, (rating: RatingValue) => setRating(rating), setLoading) }
        ratedIcon={ <RatedIcon className="h-5 w-5"/> }
        unratedIcon={ <UnratedIcon className="h-5 w-5"/> }
        ratedColor={ marked ? 'yellow' : 'gray' }
        unratedColor={ marked ? 'yellow' : 'gray' }
        readonly={ readonly || marked }
      />

      { showMarkCount && (markCount > 0) && <Typography type="small">Based on { markCount } Reviews</Typography> }
    </div>
  )
}

export default memo(Rating)