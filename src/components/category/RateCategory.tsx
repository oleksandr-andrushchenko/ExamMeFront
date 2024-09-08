import { ComponentProps, memo } from 'react'
import { apiMutate, apiQuery } from '../../api/apolloClient'
import rateCategory from '../../api/category/rateCategory'
import Category from '../../schema/category/Category'
import sleep from '../../utils/sleep'
import getCategoryRating from '../../api/category/getCategoryRating'
import Rating from '../Rating'

interface Props extends ComponentProps<any> {
  category: Category,
  showAverageMark?: boolean
  showMarkCount?: boolean
  readonly: boolean
}

const _RateCategory = (
  {
    category,
    showAverageMark = false,
    showMarkCount = false,
    readonly = false,
  }: Props,
) => {
  return (
    <Rating
      rating={ category.rating }
      showAverageMark={ showAverageMark }
      showMarkCount={ showMarkCount }
      onChange={
        (mark, setRating, { setError, setLoading }) => {
          setLoading(true)
          apiMutate(
            rateCategory(category.id!, mark),
            async (data: { rateCategory: Category }) => {
              await sleep(1000)
              apiQuery(
                getCategoryRating(data.rateCategory.id!),
                (data: { category: Category }) => setRating(data.category.rating),
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