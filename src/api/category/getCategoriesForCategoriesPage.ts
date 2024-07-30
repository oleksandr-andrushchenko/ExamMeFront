import { gql } from '@apollo/client'
import GetCategories from '../../schema/category/GetCategories'

export default function getCategoriesForCategoriesPage(filter: GetCategories = {}): any {
  return {
    query: gql`
        query GetCategoriesForCategoriesPage(
            $size: Int,
            $prevCursor:
            String,
            $nextCursor: String,
            $cursor: String,
            $order: String,
            $subscription: String,
            $approved: String,
            $creator: String,
            $search: String
        ) {
            paginatedCategories(
                size: $size,
                prevCursor: $prevCursor,
                nextCursor: $nextCursor,
                cursor: $cursor,
                order: $order,
                subscription: $subscription,
                approved: $approved,
                creator: $creator,
                search: $search
            ) {
                data {
                    id
                    name
                    questionCount
                    approvedQuestionCount
                    requiredScore
                    isApproved
                    isOwner
                    isCreator
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