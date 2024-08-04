import { gql } from '@apollo/client'
import ActivityQuery from '../../schema/activity/ActivityQuery'

export default function getActivities(query: ActivityQuery = {}): any {
  return {
    query: gql`
        query GetActivities(
            $prevCursor: String,
            $nextCursor: String,
            $cursor: String,
            $size: Int,
            $order: String
        ) {
            activities(
                prevCursor: $prevCursor,
                nextCursor: $nextCursor,
                cursor: $cursor,
                size: $size,
                order: $order
            ) {
                event
                categoryId
                categoryName
            }
        }
    `,
    variables: query,
  }
}