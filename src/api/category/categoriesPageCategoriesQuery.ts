import { gql } from '@apollo/client'
import CategoryQuery from '../../schema/category/CategoryQuery'

export const categoriesPageCategoriesQuery = (filter: CategoryQuery): any => {
  if ('size' in filter) {
    filter.size = +filter.size
  }

  return {
    query: gql`
        query CategoriesPageCategories($size: Int, $prevCursor: String, $nextCursor: String, $cursor: String, $order: String, $price: String, $search: String) {
            paginatedCategories(size: $size, prevCursor: $prevCursor, nextCursor: $nextCursor, cursor: $cursor, order: $order, price: $price, search: $search) {
                data {id name questionCount}
                meta {nextCursor prevCursor}
            }
        }
    `,
    variables: filter,
  }
}