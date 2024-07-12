import { gql } from '@apollo/client'
import GetCategories from '../../schema/category/GetCategories'

export default function getCategoriesForCategoriesPage(filter: GetCategories = {}): any {
  if ('size' in filter) {
    filter.size = +filter.size
  }

  return {
    query: gql`
        query GetCategoriesForCategoriesPage(
            $size: Int,
            $prevCursor:
            String,
            $nextCursor: String,
            $cursor: String,
            $order: String,
            $price: String,
            $search: String
        ) {
            paginatedCategories(
                size: $size,
                prevCursor: $prevCursor,
                nextCursor: $nextCursor,
                cursor: $cursor,
                order: $order,
                price: $price,
                search: $search
            ) {
                data {
                    id
                    name
                    questionCount
                    requiredScore
                    ownerId
                }
                meta {
                    nextCursor
                    prevCursor
                }
            }
        }
    `,
    variables: filter,
  }
}