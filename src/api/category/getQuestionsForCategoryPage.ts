import { gql } from '@apollo/client'
import GetQuestions from '../../schema/question/GetQuestions'

export default function getQuestionsForCategoryPage(categoryId: string, filter: GetQuestions = {}): any {
  filter.category = categoryId

  if ('size' in filter) {
    filter.size = +filter.size
  }

  return {
    query: gql`
        query CategoryPageQuestions(
            $prevCursor: String,
            $nextCursor: String,
            $cursor: String,
            $size: Int,
            $order: String,
            $subscription: String,
            $approved: String,
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
                category: $category,
                search: $search,
                difficulty: $difficulty,
                type: $type
            ) {
                data {
                    difficulty
                    id
                    title
                    type
                    categoryId
                    choices {
                        title
                        correct
                        explanation
                    }
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