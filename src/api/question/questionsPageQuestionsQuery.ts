import { gql } from '@apollo/client'
import QuestionQuery from '../../schema/question/QuestionQuery'

export default function questionsPageQuestionsQuery(filter: QuestionQuery = {}): any {
  if ('size' in filter) {
    filter.size = +filter.size
  }

  return {
    query: gql`
        query QuestionsPageQuestions(
            $prevCursor: String,
            $nextCursor: String,
            $cursor: String,
            $size: Int,
            $order: String,
            $price: String,
            $categoryId: ID,
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
                price: $price,
                categoryId: $categoryId,
                search: $search,
                difficulty: $difficulty,
                type: $type
            ) {
                data {
                    id
                    categoryId
                    title
                    type
                    answers {
                        variants
                        correct
                        explanation
                    }
                    choices {
                        title
                        correct
                        explanation
                    }
                    difficulty
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
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  }
}