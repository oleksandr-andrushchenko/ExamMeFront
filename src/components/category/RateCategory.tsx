import { ComponentProps, memo } from 'react'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import rateCategory from '../../api/category/rateCategory'
import Category from '../../schema/category/Category'
import sleep from '../../utils/sleep'
import Rating from '../Rating'
import getCategory from '../../api/category/getCategory'

interface Props extends ComponentProps<any> {
  className?: string
  category: Category,
  showAverageMark?: boolean
  showMarkCount?: boolean
  onChange?: Function
  readonly?: boolean
}

const _RateCategory = (
  {
    className = '',
    category,
    onChange,
    showAverageMark = false,
    showMarkCount = false,
    readonly = false,
  }: Props,
) => {
  return (
    <Rating
      className={ className }
      rating={ category.rating! }
      showAverageMark={ showAverageMark }
      showMarkCount={ showMarkCount }
      onChange={
        (mark, setRating, { setError, setLoading }) => {
          setLoading(true)
          apiMutate(
            rateCategory(category.id!, mark),
            async (data: { rateCategory: Category }) => {
              await sleep(100)
              apiQuery(
                getCategory(data.rateCategory.id!),
                (data: { category: Category }) => {
                  setRating(data.category.rating)
                  onChange && onChange(data.category)
                },
                setError,
              ).finally(() => setLoading(false))
            },
            setError,
          )
        }
      }
      readonly={ readonly }
    />
  )
}

export const RateCategory = memo(_RateCategory)