import { ComponentProps, memo, useState } from 'react'
import { Rating as MlRating, Typography } from '@material-tailwind/react'
import { Star as UnratedIcon, StarFill as RatedIcon } from 'react-bootstrap-icons'
import { default as RatingValue } from '../schema/rating/Rating'
import Spinner from './Spinner'
import Error from './Error'

interface Props extends ComponentProps<any> {
  rating: RatingValue | null
  showAverageMark?: boolean
  showMarkCount?: boolean
  onChange: (mark: number, setRating: Function, {
    setLoading = () => {
    },
    setError = () => {
    },
  }: { setLoading: Function, setError: Function }) => void
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
  const [ _rating, _setRating ] = useState(rating)
  const [ isLoading, setLoading ] = useState(false)
  const [ error, setError ] = useState('')
  const { averageMark = 0, markCount = 0, mark } = _rating ?? {}
  const marked = mark !== null && mark !== undefined

  if (error) {
    return (
      <Error text={ error } simple/>
    )
  }

  if (isLoading) {
    return (
      <Spinner/>
    )
  }

  const setRating = (rating: RatingValue) => _setRating(rating)

  return (
    <div className="flex items-center gap-2">
      { showAverageMark && (averageMark > 0) && <Typography type="small">{ averageMark }</Typography> }

      <MlRating
        value={ Math.floor(averageMark) }
        count={ 5 }
        onChange={ (mark: number) => onChange(mark, setRating, { setLoading, setError }) }
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