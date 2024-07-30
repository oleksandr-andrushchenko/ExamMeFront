import { gql } from '@apollo/client'
import GetQuestions from '../../schema/question/GetQuestions'

export default function getQuestionsForQuestionsPage(filter: GetQuestions = {}): any {
  return {
    query: gql`
        query GetQuestionsForQuestionsPage(
            $prevCursor: String,
            $nextCursor: String,
            $cursor: String,
            $size: Int,
            $order: String,
            $subscription: String,
            $approved: String,
            $creator: String,
            $category: ID,
            $search: String,
            $difficulty: String,
            $type: String
        ) {
            paginatedQuestions(
                prevCursor: $prevCursor,
                nextCursor: $nextCursor,
                cursor: $cursor,
                size: $size,
                order: $order,
                subscription: $subscription,
                approved: $approved,
                creator: $creator,
                category: $category,
                search: $search,
                difficulty: $difficulty,
                type: $type
            ) {
                data {
                    id
                    categoryId
                    title
                    type
                    choices {
                        title
                        correct
                        explanation
                    }
                    difficulty
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