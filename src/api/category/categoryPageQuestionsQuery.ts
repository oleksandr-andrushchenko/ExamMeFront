import { gql } from '@apollo/client'
import QuestionQuery from '../../schema/question/QuestionQuery'

export default function categoryPageQuestionsQuery(categoryId: string, filter: QuestionQuery = {}): any {
  filter.categoryId = categoryId

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
                    difficulty
                    id
                    title
                    type
                    categoryId
                    answers {variants correct explanation}
                    choices {title correct explanation}
                }
                meta {nextCursor prevCursor}
            }
        }
    `,
    variables: filter,
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  }
}